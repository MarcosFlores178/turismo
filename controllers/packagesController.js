const { Ciudad } = require('../db/models');
const { Pais } = require('../db/models');
const { Paquete } = require('../db/models');
const { PaqueteCiudad } = require('../db/models');
const { sequelize } = require('../db/models');

exports.mostrarFormularioCreacion = async (req, res) => {
   
  try {
    console.log('🟡 2. Antes de Ciudad.findAll');
    // Obtener todas las ciudades con información de país
    const ciudades = await Ciudad.findAll({
      include: [{
        model: Pais,
        as: 'pais', // ← ¡ESTA LÍNEA FALTA!
        attributes: ['nombre']
      }],
      order: [['nombre', 'ASC']],
      logging: console.log // ← Muestra la consulta SQL en consola
    });
console.log('🟢 3. Después de Ciudad.findAll - Éxito');
    console.log('Ciudades encontradas:', ciudades.length);
    ciudades.forEach((ciudad, index) => {
      console.log(`${index + 1}. ${ciudad.nombre} - País: ${ciudad.pais ? ciudad.pais.nombre : 'UNDEFINED'}`);
    });

    res.render('pages/makePackages', {
      title: 'Crear Nuevo Paquete',
      ciudades,
      cssFile: "makePackage.css"
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
exports.crearPaquete = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { nombre, destino, descripcion, precio, duracion_dias, es_destacado, ciudades } = req.body;

      // CONVERSIÓN CORRECTA para esDestacado
    const esDestacadoBool = es_destacado === 'true' || es_destacado === '1' || es_destacado === true;

    // 1. Validar que ciudades sea un array
    const ciudadesSeleccionadas = Array.isArray(ciudades) ? ciudades : [ciudades];
    
    if (ciudadesSeleccionadas.length === 0) {
      throw new Error('Debe seleccionar al menos una ciudad');
    }

    // 2. Crear el paquete (SOLO datos del paquete, NO ciudades)
    const nuevoPaquete = await Paquete.create({
      nombre: nombre.toString().trim(),
      destino: destino.toString().trim(), 
      descripcion: descripcion.toString().trim(),
      precio: parseFloat(precio),
      duracion_dias: duracion_dias ? parseInt(duracion_dias) : null,
      es_destacado: esDestacadoBool
    }, { transaction });

    // 3. Crear relaciones en tabla intermedia PaqueteCiudad
    const relacionesCiudades = ciudadesSeleccionadas.map(ciudadId => ({
      id_paquete: nuevoPaquete.id_paquete,
      id_ciudad: parseInt(ciudadId)
    }));

    await PaqueteCiudad.bulkCreate(relacionesCiudades, { transaction });

    await transaction.commit();
    res.redirect(`/paquetes/${nuevoPaquete.id}?success=Paquete creado correctamente`);

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear paquete:', error);

    // Recargar ciudades para mostrar el formulario de nuevo
    const ciudades = await Ciudad.findAll({
      include: [{
        model: Pais,
        as: 'pais',
        attributes: ['nombre']
      }],
      order: [['nombre', 'ASC']]
    });

    res.render('pages/makePackages', {
      title: 'Crear Nuevo Paquete',
      ciudades,
      error: 'Error al crear paquete: ' + error.message,
      formData: req.body
    });
  }
};