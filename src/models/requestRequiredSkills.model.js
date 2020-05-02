export default function(sequelize, DataTypes) {
    const requestRequiredSkill = sequelize.define(
        'requestRequiredSkill', // Model Name
        {
            requestId: {
                type: DataTypes.INTEGER,
            },
            skillId: {
                type: DataTypes.INTEGER,
            }
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    requestRequiredSkill.associate = function(models) {
        requestRequiredSkill.belongsTo(models.sittingRequest, {
            foreignKey: {
                name: 'requestId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'sittingRequest',
            onDelete: 'CASCADE',
        });

        requestRequiredSkill.belongsTo(models.skill, {
            foreignKey: {
                name: 'skillId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'skill',
            onDelete: 'CASCADE',
        });
    };

    return requestRequiredSkill;
}
