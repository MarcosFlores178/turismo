// seedData.js
const { sequelize, Continente, Pais, Ciudad } = require('./db/models'); // ← Ruta correcta

const seedDatabase = async () => {
  try {
    console.log('🔵 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida');

    // Sincronizar modelos (crea tablas si no existen)
    console.log('🔄 Sincronizando tablas...');
    await sequelize.sync({ force: false });
    console.log('✅ Tablas sincronizadas');

    // Verificar si ya hay datos
    const continenteCount = await Continente.count();
    if (continenteCount > 0) {
      console.log('⚠️  Ya existen datos en la BD. No se insertaron nuevos datos.');
      return;
    }

    console.log('🌍 Insertando continentes...');
    const asia = await Continente.create({ nombre: 'Asia' });
    const europa = await Continente.create({ nombre: 'Europa' });
    const america = await Continente.create({ nombre: 'América' });
    const africa = await Continente.create({ nombre: 'África' });
    const oceania = await Continente.create({ nombre: 'Oceanía' });

    console.log('🇺🇳 Insertando países...');
    const turquia = await Pais.create({ nombre: 'Turquía', id_continente: asia.id_continente });
    const francia = await Pais.create({ nombre: 'Francia', id_continente: europa.id_continente });
    const espana = await Pais.create({ nombre: 'España', id_continente: europa.id_continente });
    const argentina = await Pais.create({ nombre: 'Argentina', id_continente: america.id_continente });
    const mexico = await Pais.create({ nombre: 'México', id_continente: america.id_continente });

    console.log('🏙️  Insertando ciudades...');
    await Ciudad.bulkCreate([
      // Turquía
      { nombre: 'Ankara', id_pais: turquia.id_pais },
      { nombre: 'Estambul', id_pais: turquia.id_pais },
      { nombre: 'Izmir', id_pais: turquia.id_pais },
      
      // Francia
      { nombre: 'París', id_pais: francia.id_pais },
      { nombre: 'Lyon', id_pais: francia.id_pais },
      { nombre: 'Marsella', id_pais: francia.id_pais },
      
      // España
      { nombre: 'Madrid', id_pais: espana.id_pais },
      { nombre: 'Barcelona', id_pais: espana.id_pais },
      { nombre: 'Sevilla', id_pais: espana.id_pais },
      
      // Argentina
      { nombre: 'Buenos Aires', id_pais: argentina.id_pais },
      { nombre: 'Mendoza', id_pais: argentina.id_pais },
      { nombre: 'Córdoba', id_pais: argentina.id_pais },
      
      // México
      { nombre: 'Ciudad de México', id_pais: mexico.id_pais },
      { nombre: 'Cancún', id_pais: mexico.id_pais },
      { nombre: 'Guadalajara', id_pais: mexico.id_pais }
    ]);

    console.log('✅ Datos insertados correctamente!');
    console.log('📊 Resumen:');
    console.log(`   - Continentes: ${await Continente.count()}`);
    console.log(`   - Países: ${await Pais.count()}`);
    console.log(`   - Ciudades: ${await Ciudad.count()}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
    console.log('🔴 Conexión cerrada');
    process.exit(0);
  }
};

// Ejecutar
seedDatabase();