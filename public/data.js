 var app = new Vue({
     el: "#app",
     data: {
         league: [],
         datesC: [],
         teamsC: [],
         playersC: [],
         tracksC: [],
         equipoC: [],
         web: "main",
         loading: false,
         login: true,
         logout: false,
     },

     methods: {
         fetchInit: function () {
             fetch("https://api.jsonbin.io/b/5bebe92d0692212d42fbb8b3/5", {
                 headers: {}
             }).then(function (data) {
                 return data.json();
             }).then(function (myData) {
                 app.league = myData.league;
                 app.datesC = myData.league[0].dates;
                 app.teamsC = myData.league[0].teams;
                 app.equipoC = myData.league[0].teams[0];
                 app.playersC = app.allPlayers();
                 app.tracksC = myData.league[0].tracks;
                 app.loading = true;
             })
         },

         //----------HIDE AND SHOW HTML-----------//


         showPage: function (id, equipo) {
             this.web = id;
             if (this.web == "chat" && this.login == true && this.logout == false || this.web == "match" && this.login == true && this.logout == false) {
                 this.web = "main";
                 alert("Login First for see this");
             }
         },

         showTeam: function (equipo) {
             this.equipoC = equipo;
             console.log(equipo);
         },

         //-----------ARRAY PLAYERS------------//
         allPlayers: function () {
             var arrayPlayers = [];
             for (var i = 0; i < this.league[0].teams.length; i++) {
                 for (var k = 0; k < this.league[0].teams[i].players.length; k++) {
                     arrayPlayers.push(this.league[0].teams[i].players[k]);
                 }
             }
             arrayPlayers.sort(function (a, b) {
                 if (a.total_points < b.total_points)
                     return 1;
                 if (a.total_points > b.total_points)
                     return -1;
                 return 0;
             });
             return arrayPlayers;
         },

         //------------CHAT------------//

         logins: function () {
             // https://firebase.google.com/docs/auth/web/google-signin
             // Provider
             var provider = new firebase.auth.GoogleAuthProvider();
             // How to Log In
             firebase.auth().signInWithPopup(provider);
             var signed = !!firebase.auth().currentUser;
             this.login = false;
             this.logout = true;
             console.log("login");
             console.log(signed);
         },
         
         writeNewPost: function () {
             if (this.logout == false) {
                 alert("Login First for use Chat");
             } else {
                 // https://firebase.google.com/docs/database/web/read-and-write
                 // Values
                 var textInput = document.getElementById("textInput").value;
                 console.log(textInput);
                 var userName = firebase.auth().currentUser.displayName;
                 console.log(userName);
                 // Returns the signed-in user's profile pic URL.
                 var pic = firebase.auth().currentUser.photoURL;
                 console.log(pic);
                 // A post entry.
                 var message = {
                     messageText: textInput,
                     name: userName,
                     avatar: pic
                 };
                 console.log(textInput);
                 textInput = document.getElementById("textInput").value = "";
                 // Get a key for a new Post.
                 firebase.database().ref("myChat").push(message);
                 //Write data
                 console.log("write");
             }
         },
         getPosts: function () {
             firebase.database().ref('myChat').on('value', function (data) {
                 var posts = document.getElementById("posts");
                 posts.innerHTML = "";
                 var messages = data.val();
                 for (var key in messages) {
                     console.log(messages[key])

                     var text = document.createElement("div");
                     text.className = "textChat";

                     var element = messages[key];

                     var userImg = document.createElement("img");
                     userImg.setAttribute("src", messages[key].avatar);
                     userImg.setAttribute("class", "userImg");

                     var names = document.createElement("h5");
                     names.className = "nameClass";

                     var mestext = document.createElement("p");
                     mestext.className = "messageClass";

                     text.append(userImg, names, mestext);
                     names.append(element.name + " (say) : ");
                     mestext.append(element.messageText);
                     posts.append(text);
                 }
             })

         },

         logouts: function () {
             firebase.auth().signOut().then(function () {
                 // Sign-out successful.
                 alert("Sign-out succesful.");

             }, function (error) {
                 // An error happened.
                 alert("An error happened.");

             });
             this.logout = false;
             this.login = true;
         }

     },
     created: function () {
         this.fetchInit();
         this.getPosts();
     }
 })
