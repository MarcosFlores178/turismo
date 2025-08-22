const { Ciudad } = require('../db/models');
const { Pais } = require('../db/models');

exports.mostrarFormularioCreacion = async (req, res) => {
    console.log('🔵 1. Entrando al controlador');
  try {
    console.log('🟡 2. Antes de Ciudad.findAll');
    // Obtener todas las ciudades con información de país
    const ciudades = await Ciudad.findAll({
      include: [{
        model: Pais,
        as: 'pais', // ← ¡ESTA LÍNEA FALTA!
        attributes: ['nombre']
      }],
      order: [['nombre', 'ASC']]
    });
console.log('🟢 3. Después de Ciudad.findAll - Éxito');
    console.log('Ciudades encontradas:', ciudades.length);

    res.render('pages/makePackages', {
      title: 'Crear Nuevo Paquete',
      ciudades
    });
  } catch (error) {
    // res.status(500).render('error', { error: 'Error al cargar formulario' });
    // ✅ Renderiza la misma vista con mensaje de error
    res.render('pages/makePackages', {
      title: 'Crear Nuevo Paquete',
      ciudades: [],
      error: 'Error al cargar las ciudades: ' + error.message
    });
  
  }
};