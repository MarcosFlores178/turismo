var express = require('express');
var router = express.Router();
let packagesController = require('../controllers/packagesController');
const { uploadMiddleware } = require('../config/multer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express papaaaa!!!' });
});

/* GET crear paquete page. */
router.get('/make', packagesController.mostrarFormularioCreacion);
router.post('/make', uploadMiddleware, packagesController.crearPaquete);

router.get('/list', packagesController.listarPaquetes);
router.get('/details/:id', packagesController.mostrarDetallesPaquete);
router.get('/contact/:id', packagesController.mostrarFormularioConsulta);
router.get('/edit/:id', packagesController.mostrarFormularioEdicion);
router.post('/edit/:id', uploadMiddleware, packagesController.guardarPaqueteEditado);

module.exports = router;
