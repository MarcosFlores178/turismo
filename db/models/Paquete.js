module.exports = (sequelize, DataTypes) => {
  const Paquete = sequelize.define('paquetes', {
    id_paquete: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destino: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Paquete.associate = (models) => {
    Paquete.belongsToMany(models.Ciudad, {
      through: 'PaqueteCiudad',
      foreignKey: 'id_paquete',
      as: 'ciudades'
    });
  };

  return Paquete;
};