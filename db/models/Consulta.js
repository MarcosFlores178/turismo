// models/Consulta.js
module.exports = (sequelize, DataTypes) => {
  const Consulta = sequelize.define("Consulta", {
    id_consulta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    id_usuario: { // ← FK al usuario (guest o registrado)
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuario"
      }
    },
    id_paquete: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "paquetes",
        key: "id_paquete"
      }
    }
  }, {
    tableName: "consultas"
  });

  Consulta.associate = (models) => {
    Consulta.belongsTo(models.Usuario, {
      foreignKey: "id_usuario",
      as: "usuario"
    });

    Consulta.belongsTo(models.Paquete, {
      foreignKey: "id_paquete",
      as: "paquete"
    });
  };

  return Consulta;
};