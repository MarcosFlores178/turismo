// controllers/homeController.js
const { Paquete } = require('../db/models');

exports.index = async (req, res) => {
  try {
    // Obtener solo paquetes destacados (no todos)
    const paquetesDestacados = await Paquete.findAll({
      where: { 
        es_destacado: true,     // Campo booleano en tu modelo
        esta_activo: true       // Para no mostrar paquetes inactivos
      },
      limit: 6,                // Solo 6 paquetes destacados
      order: [['createdAt', 'DESC']] // Los más recientes primero
    });

    res.render('pages/home', {
      title: 'Inicio - Agencia de Viajes',
      paquetesDestacados,
      // Otros datos específicos del home...
    });
  } catch (error) {
    console.error('Error en homeController:', error);
    res.status(500).render('error', { error: 'Error al cargar la página' });
  }
};

exports.about = (req, res) => {
  res.render('home/about', { title: 'Nosotros' });
};

exports.contact = (req, res) => {
  res.render('home/contact', { title: 'Contacto' });
};