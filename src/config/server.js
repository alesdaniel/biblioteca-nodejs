const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express(); //Carga el modulo

//settings
app.set('port', process.env.PORT || 3000); //puerto por variable de entorno
console.log(path.join(__dirname))
//app.set('views','/home/daniel/ungs/nodejs/Mysql/src/app/views');
app.set('views', path.join(__dirname,'../app/views/')); //ubicacion de las plantillas*/

app.set('view engine', 'ejs');  //define motor de plantillas

//middleware
app.use(express.text());
app.use(bodyParser.urlencoded({extended:false})); //facilita la comunicacioin entrre html y nodejs
module.exports = app; //exporta la app

