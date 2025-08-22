module.exports = (sequelize, DataTypes) => {
  const Pais = sequelize.define('Pais', {
    id_pais: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_continente: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'paises',
    timestamps: false
  });

  Pais.associate = (models) => {
    Pais.belongsTo(models.Continente, {
      foreignKey: 'id_continente',
      as: 'continente'
    });
    Pais.hasMany(models.Ciudad, {
      foreignKey: 'id_pais',
      as: 'ciudades'
    });
  };

  return Pais;
};
