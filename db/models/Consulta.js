module.exports = (sequelize, DataTypes) => {
  const Consulta = sequelize.define("consultas", {
    id_consulta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pregunta: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Usuarios",
        key: "id_usuario"
      }
    }
  });

  return Consulta;
};
