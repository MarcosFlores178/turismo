// models/Usuario.js
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define("usuarios", {
    id_usuario: {
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
      unique: true, // ← IMPORTANTE: evitar duplicados por email
      validate: { isEmail: true }
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true // No obligatorio
    },
    es_registrado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false // false = usuario guest (no registrado)
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Consulta, {
      foreignKey: "id_usuario",
      as: "consultas"
    });
  };

  return Usuario;
};