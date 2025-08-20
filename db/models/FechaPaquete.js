module.exports = (sequelize, DataTypes) => {
  const FechaPaquete = sequelize.define('fechas_paquetes', {
    id_fecha_paquete: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha_salida: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_regreso: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_paquete: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_temporada: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    cupos_disponibles: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  FechaPaquete.associate = (models) => {
    FechaPaquete.belongsTo(models.Paquete, {
      foreignKey: 'id_paquete',
      as: 'paquete'
    });
  };

  return FechaPaquete;
};
