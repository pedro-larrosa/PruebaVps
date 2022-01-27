const express = require('express');
const multer = require('multer');
//configurar la subida de imagenes
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imagenes');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

let upload = multer({ storage: storage });

let Libro = require(__dirname + '/../models/libro.js');
let router = express.Router();

// Servicio de listado general
router.get('/', (req, res) => {
  Libro.find()
    .then((libros) => {
      res.render('libros_listado', { libros: libros });
    })
    .catch(() => {
      res.render('error', { error: 'Error listando libros' });
    });
});

//Renderizado del formulario de inserción
router.get('/nuevo', (req, res) => {
  res.render('libros_nuevo');
});

// Servicio de listado por id
router.get('/:id', (req, res) => {
  Libro.findById(req.params.id)
    .then((resultado) => {
      if (resultado) res.render('libros_ficha', { libro: resultado });
      else
        res.render('error', {
          ok: false,
          error: 'No se han encontrado libros'
        });
    })
    .catch(() => {
      res.render('error', {
        error: 'Error buscando el libro indicado'
      });
    });
});

router.get('/:id/editar', (req, res) => {
  Libro.findById(req.params.id)
    .then((resultado) => {
      if (resultado) res.render('libros_editar', { libro: resultado });
      else res.render('error', { error: 'No se han encontrado libros' });
    })
    .catch(() => {
      res.render('error', {
        error: 'Error buscando el libro indicado'
      });
    });
});

// Servicio para insertar libros
router.post('/', upload.single('portada'), (req, res) => {
  let filename = req.file ? req.file.filename : null;
  let nuevoLibro = new Libro({
    titulo: req.body.titulo,
    editorial: req.body.editorial,
    precio: req.body.precio,
    portada: filename
  });

  nuevoLibro
    .save()
    .then(() => {
      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      res.render('error', {
        error: 'Error insertando un libro en la base de datos'
      });
    });
});

// Servicio para modificar libros
router.put('/:id' /*, upload.single('portada')*/, (req, res) => {
  //let filename = req.file ? req.file.filename : null;
  Libro.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        titulo: req.body.titulo,
        editorial: req.body.editorial,
        precio: req.body.precio
        //portada: filename
      }
    },
    { new: true }
  )
    .then((resultado) => {
      if (resultado) res.redirect(req.baseUrl);
      else
        res.render('error', {
          error: 'No se ha encontrado el libro para actualizar'
        });
    })
    .catch((error) => {
      res.send('render', { error: 'Error actualizando libro' });
    });
});

// Servicio para borrar libros
router.delete('/:id', (req, res) => {
  Libro.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      if (resultado) res.status(200).redirect(req.baseUrl);
      else
        res.status(400).render('error', {
          error: 'No se ha encontrado el libro para eliminar'
        });
    })
    .catch((error) => {
      res.status(400).render('error', { error: 'Error eliminando libro' });
    });
});

module.exports = router;
