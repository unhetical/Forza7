 var app = new Vue({
     el: "#app",
     data: {
         weathers: [],
         text: "",
         notFound: false,
         info: false,
         gifsun: false,
         gifcloud: false,
         gifrain: false,
         gifstorm: false
     },

     methods: {
         fetchInit: function (url) {
             fetch("https://api.myjson.com/bins/i8run", {
                 headers: {}
             }).then(function (data) {
                 return data.json();
             }).then(function (myData) {
                 app.weathers = myData.list;
                 console.log(app.weathers);
                 app.fetchIni2(this.url2);

             })
         },
         
         fetchIni2: function (url2) {
             fetch("http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=4d356077513826c290f004daa31c232b", {
                 headers: {}
             }).then(function (data) {
                 return data.json();
             }).then(function (myData) {
                 app.weathers.push(myData);

             })
         },
         
         showTable: function () {
             if (this.info == false) {
                 this.info = true;
             } else {
                 this.info = false;
             }
         },

         showGif: function (weather) {
             var gif = "";

             if (weather == "Rain") {
                 gif = "https://media.giphy.com/media/3oEdvbelTmMXOQ9VDO/giphy-downsized-large.gif";
             }
             if (weather == "Clouds") {
                 gif = "https://media.giphy.com/media/l2QEikgvMogv2Lmww/giphy.gif";
             }
             if(weather == "Sun" || weather == "Sunny"){
                 gif = "https://media.giphy.com/media/nYiHd4Mh3w6fS/giphy.gif";
             }
             if (weather == "Snow") {
                 gif = "https://media.giphy.com/media/Zt6W9aiKkUSZy/giphy.gif";
             }
             if(weather== "Mist" || weather == "Haze" || weather == "Fog"){
                 gif = "https://media.giphy.com/media/E2A8QjNoOtEGY/giphy.gif";
             }
             
             return gif;
         }
         
     },

     created: function () {
         this.fetchInit(this.url);
          
     },

     computed: {

         filter: function () {
             var arrayTable = [];
             for (var i = 0; i < this.weathers.length; i++) {

                 if (this.text == "" || this.weathers[i].name.toLowerCase().includes(this.text.toLowerCase())) {
                     arrayTable.push(this.weathers[i]);

                 }
             }

             return arrayTable;
         }

     },

     updated: function () {
         var cardsChild = document.getElementById("child");

         if (cardsChild.children.length == 0) {
             this.notFound = true;
         } else {
             this.notFound = false;
         }
     }

 })
