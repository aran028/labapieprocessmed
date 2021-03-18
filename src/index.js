const mysql = require("mysql");
const express = require("express");
//Traigo libreria body-parser
const bodyParser = require("body-parser");
//creo mi aplicacion de express
const app = express();
var http = require('http');
// Para evitar error de cors en la respuesta
const cors = require('cors')
const corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions));
const host='localhost';
const port=3000;

//Settings
//Configuras el puerto y si no existe puerto donde despliegas la aplicacion en un servicio le asignas el 3000
app.set("port", process.env.PORT || 3000);

var server = http.createServer(app);

app.get('/', function(req, res) {
    res.send("Hello World!");
});

server.listen(3000, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});

//Middlewares

app.use(express.json({ limit: "250mb" }));
app.use(bodyParser.json({ limit: "250mb" }));
app.use(bodyParser.urlencoded({ limit: "250mb", extended: true }));

//Routes: la aplicacion utilizará estas rutas
app.use(require("./routes/index"));



// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
server.listen(port,host,()=>{
    console.log(`Servidor corriendo en http://${host}:${port}`);
});
