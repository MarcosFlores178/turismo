module.exports = (sequelize, DataTypes) => {
    const PaqueteCiudad = sequelize.define('PaqueteCiudad', {
        id_paquete: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Paquete',
                key: 'id_paquete'
            }
        },
        id_ciudad: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Ciudad',
                key: 'id_ciudad'
            }
        },
        orden_visita: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        es_destino_principal: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    },
{
    tableName: 'paquetes_ciudades',
    timestamps: false
});

    PaqueteCiudad.associate = (models) => {
        PaqueteCiudad.belongsTo(models.Paquete, {
            foreignKey: 'id_paquete',
            as: 'paquete'
        });
        PaqueteCiudad.belongsTo(models.Ciudad, {
            foreignKey: 'id_ciudad',
            as: 'ciudad'
        });
    };

    return PaqueteCiudad;
};
