const upload = require('../config/multer');
const { sequelize, Paquete, Ciudad, Imagen, PaqueteCiudad, Pais } = require('../db/models');

// exports.upload = upload.array('imagenes', 10); // Máximo 10 imágenes

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
  const transaction = await sequelize.transaction(); // ← Crear transaction
  
  try {
    console.log('📦 req.body:', req.body);
    console.log('📸 req.files:', req.files);
    
    const { nombre, destino, descripcion, precio, duracion_dias, es_destacado, ciudades } = req.body;
    const imagenesSubidas = req.files['imagenes'] || [];
    const imagenPortada = req.body.imagenPortada || '0';

    const esDestacadoBool = es_destacado === 'true' || es_destacado === '1' || es_destacado === true;

    // 1. CREAR PAQUETE (con transaction)
    const nuevoPaquete = await Paquete.create({
      nombre: nombre.toString().trim(),
      destino: destino.toString().trim(),
      descripcion: descripcion.toString().trim(),
      precio: parseFloat(precio),
      duracion_dias: duracion_dias ? parseInt(duracion_dias) : null,
      es_destacado: esDestacadoBool
    }, { transaction }); // ← Transaction aquí

    // 2. PROCESAR CIUDADES (con transaction)
    const ciudadesSeleccionadas = Array.isArray(ciudades) ? ciudades : [ciudades];
    if (ciudadesSeleccionadas.length > 0) {
      const relacionesCiudades = ciudadesSeleccionadas.map(ciudadId => ({
        id_paquete: nuevoPaquete.id_paquete,
        id_ciudad: parseInt(ciudadId),
        es_destino_principal: parseInt(req.body.es_destino_principal) === parseInt(ciudadId),
        orden_visita: parseInt(req.body[`orden_visita_${ciudadId}`]) || 1
      }));
      await PaqueteCiudad.bulkCreate(relacionesCiudades, { transaction });
    }

    // 3. PROCESAR IMÁGENES (con transaction)
    if (imagenesSubidas.length > 0) {
      const imagenes = imagenesSubidas.map((file, index) => ({
        ruta: '/uploads/paquetes/' + file.filename,
        id_paquete: nuevoPaquete.id_paquete,
        es_portada: parseInt(imagenPortada) === index
      }));
      await Imagen.bulkCreate(imagenes, { transaction }); // ← Transaction aquí
    }

    // 4. SI TODO SALE BIEN - COMMIT
    await transaction.commit();
    console.log('✅ Transacción completada exitosamente');

    res.redirect(`/paquetes/${nuevoPaquete.id_paquete}?success=Paquete creado con imágenes`);

  } catch (error) {
    // 5. SI HAY ERROR - ROLLBACK
    await transaction.rollback();
    console.error('❌ Error en la transacción:', error);

    // 6. ELIMINAR IMÁGENES SUBIDAS (si se subieron antes del error)
    if (req.files && req.files['imagenes']) {
      const fs = require('fs');
      req.files['imagenes'].forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log('🗑️ Imagen eliminada:', file.path);
          }
        } catch (unlinkError) {
          console.error('Error eliminando imagen:', unlinkError);
        }
      });
    }

    // 7. RECARGAR DATOS PARA MOSTRAR FORMULARIO DE NUEVO
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

exports.listarPaquetes = async (req, res) => {
  try {
    const paquetes = await Paquete.findAll({
      include: [{
        model: Ciudad,
        as: 'ciudades',
        attributes: ['nombre']
      },
    {
      model: Imagen,  // ← ¿Está correcto el modelo?
      as: 'imagenes',
      attributes: ['ruta', 'es_portada', 'id_imagen']
    }],
      order: [['nombre', 'ASC']]
    });

    res.render('pages/listaPackages', {
      title: 'Mostrar Paquetes',
      paquetes,
      successMessage: req.query.success
    });
    // DEBUG: Verifica qué se está obteniendo
console.log('Número de paquetes:', paquetes.length);
if (paquetes.length > 0) {
  console.log('Imágenes del primer paquete:', paquetes[0].imagenes);
}
  } catch (error) {
    console.error('Error al mostrar paquetes:', error);
    res.render('pages/listaPackages', {
      title: 'Mostrar Paquetes',
      error: 'Error al cargar paquetes: ' + error.message
    });
  }
};

exports.mostrarDetallesPaquete = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id, {
      include: [{
        model: Ciudad,
        as: 'ciudades',
        attributes: ['nombre']
      },
      {
        model: Imagen,
        as: 'imagenes',
        attributes: ['ruta', 'es_portada', 'id_imagen']
      }]
    });

    if (!paquete) {
      return res.status(404).render('pages/error', {
        title: 'Paquete no encontrado',
        error: 'El paquete solicitado no existe.'
      });
    }

    res.render('pages/detailsPackage', {
      title: 'Detalles del Paquete',
      paquete
    });
  } catch (error) {
    console.error('Error al mostrar detalles del paquete:', error);
    res.status(500).render('pages/error', {
      title: 'Error interno del servidor',
      error: 'No se pudo cargar el paquete: ' + error.message
    });
  }
};

exports.mostrarFormularioConsulta = async (req, res) => {
  try {
    const paquete = await Paquete.findByPk(req.params.id, {
      include: [{
        model: Ciudad,
        as: 'ciudades',
        attributes: ['nombre']
      },
      {
        model: Imagen,
        as: 'imagenes',
        attributes: ['ruta', 'es_portada', 'id_imagen']
      }]
    });

    if (!paquete) {
      return res.status(404).render('pages/error', {
        title: 'Paquete no encontrado',
        error: 'El paquete solicitado no existe.'
      });
    }

    res.render('pages/contactPackage', {
      title: 'Contacto sobre el Paquete',
      paquete
    });
  } catch (error) {
    console.error('Error al mostrar formulario de consulta:', error);
    res.status(500).render('pages/error', {
      title: 'Error interno del servidor',
      error: 'No se pudo cargar el formulario de consulta: ' + error.message
    });
  }
};

exports.mostrarFormularioEdicion = // Mostrar formulario de edición
exports.editarPaqueteView = async (req, res) => {
  try {
    const id = req.params.id;

    // Buscar paquete con relaciones
    const paquete = await Paquete.findByPk(id, {
      include: [
        {
          model: Ciudad,
          as: "ciudades",
          include: [{ model: Pais, as: "pais", attributes: ["nombre"] }]
        },
        {
          model: Imagen,
          as: "imagenes"
        }
      ]
    });

    if (!paquete) {
      return res.status(404).render("pages/error", { error: "Paquete no encontrado" });
    }

    // Traer todas las ciudades disponibles
    const ciudades = await Ciudad.findAll({
      include: [{ model: Pais, as: "pais", attributes: ["nombre"] }],
      order: [["nombre", "ASC"]]
    });

    res.render("pages/editPackage", {
      title: "Editar Paquete",
      paquete,
      ciudades
    });
  } catch (error) {
    console.error("❌ Error cargando paquete:", error);
    res.status(500).send(error.message);
  }
};

exports.guardarPaqueteEditado = async (req, res) => {
  try {
    const id_paquete = req.params.id;
    const { nombre, destino, descripcion, precio, duracion_dias, ciudades } = req.body;

    // Actualizar paquete
    await Paquete.update(
      { nombre, destino, descripcion, precio, duracion_dias },
      { where: { id_paquete }, returning: true }
    );

    // Actualizar ciudades relacionadas
    await PaqueteCiudad.destroy({ where: { id_paquete } });
    const ciudadInstances = await Ciudad.findAll({ where: { id_ciudad: ciudades } });
    await PaqueteCiudad.bulkCreate(
      ciudadInstances.map(ciudad => ({ id_paquete, id_ciudad: ciudad.id_ciudad }))
    );

    res.redirect(`/paquetes/${id_paquete}?success=Paquete actualizado con éxito`);
  } catch (error) {
    console.error("❌ Error guardando paquete editado:", error);
    res.status(500).send(error.message);
  }
};
