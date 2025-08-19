module.exports = (sequelize, DataTypes) => {
  const Imagen = sequelize.define('Imagen', {
    id_imagen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ruta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_paquete: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    es_portada: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });

  Imagen.associate = (models) => {
    Imagen.belongsTo(models.Paquete, {
      foreignKey: 'id_paquete',
      as: 'paquete'
    });
  };

  return Imagen;
};
