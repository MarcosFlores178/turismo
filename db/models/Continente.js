module.exports = (sequelize, DataTypes) => {
  const Continente = sequelize.define('continentes', {
    id_continente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Continente.associate = (models) => {
    Continente.hasMany(models.Pais, {
      foreignKey: 'id_continente',
      as: 'paises'
    });
  };

  return Continente;
};
