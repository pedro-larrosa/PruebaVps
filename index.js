/*
Ejercicio de desarrollo de servicios con Express. Sobre la base de datos de "libros" de  
sesiones anteriores, se desarrollarán los servicios básicos paras operaciones habituales de
GET, POST, PUT y DELETE. En este caso, dejamos hechas las operaciones tipo GET.

En esta versión del ejercicio, se estructura el código en carpetas separadas para modelos
y enrutadores
*/

// Carga de librería
const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

// Enrutadores
const libros = require(__dirname + '/routes/libros');
const autores = require(__dirname + '/routes/autores'); // Para la parte opcional

// Conectar con BD en Mongo
mongoose.connect('mongodb://localhost:27017/libros', {
  useNewURLParser: true,
  useUnifiedTopology: true
});

// Inicializar Express
let app = express();
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'njk');

// Cargar middleware body-parser para peticiones POST y PUT
// y enrutadores
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/public/css'));
app.use('/libros', express.static(__dirname + '/public'));
app.use('/libros', libros);
app.use('/autores', autores); // Para la parte opcional
app.get('', (req, res) => {
  res.redirect(req.baseUrl + '/libros');
});
app.get('**', (req, res) => {
  res.render('error', { error: 'Pagina no encontrada' });
});

// Puesta en marcha del servidor
app.listen(8080, 'localhost', () =>
  console.log('Servidor puesto en marcha en http://localhost:8080')
);
