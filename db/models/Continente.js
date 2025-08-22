module.exports = (sequelize, DataTypes) => {
  const Continente = sequelize.define('Continente', {
    id_continente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
{
  tableName: 'continentes',
  timestamps: false
});

  Continente.associate = (models) => {
    Continente.hasMany(models.Pais, {
      foreignKey: 'id_continente',
      as: 'paises'
    });
  };

  return Continente;
};
