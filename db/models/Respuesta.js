const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Respuesta = sequelize.define("respuestas", {
    id_respuesta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_consulta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Consulta",
        key: "id_consulta"
      },
      id_encargado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Encargado",
          key: "id_encargado"
        }
      }
    }
  });

  return Respuesta;
};