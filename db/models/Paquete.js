module.exports = (sequelize, DataTypes) => {
  const Paquete = sequelize.define('Paquete', {
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
      type: DataTypes.STRING,
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
    duracion_dias: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    es_destacado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    esta_activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  },
{
  tableName: 'paquetes'
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