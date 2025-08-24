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

module.exports = router;
