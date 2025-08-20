module.exports = (sequelize, DataTypes) => {
  const Encargado = sequelize.define("encargados", {
    id_encargado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  return Encargado;
};
