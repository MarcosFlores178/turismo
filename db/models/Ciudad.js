module.exports = (sequelize, DataTypes) => {
  const Ciudad = sequelize.define('Ciudad', {
    id_ciudad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_pais: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Ciudad.associate = (models) => {
    Ciudad.belongsTo(models.Pais, {
      foreignKey: 'id_pais',
      as: 'pais'
    });
    Ciudad.belongsToMany(models.Paquete, {
      through: 'PaqueteCiudad',
      foreignKey: 'id_ciudad',
      as: 'paquetes'
    });
  };

  return Ciudad;
};
