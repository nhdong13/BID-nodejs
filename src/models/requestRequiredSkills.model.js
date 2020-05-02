export default function(sequelize, DataTypes) {
    const requestRequiredSkills = sequelize.define(
        'requestRequiredSkills', // Model Name
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

    requestRequiredSkills.associate = function(models) {
        requestRequiredSkills.belongsTo(models.sittingRequest, {
            foreignKey: {
                name: 'requestId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'sittingRequest',
            onDelete: 'CASCADE',
        });

        requestRequiredSkills.belongsTo(models.skill, {
            foreignKey: {
                name: 'skillId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'skill',
            onDelete: 'CASCADE',
        });
    };

    return requestRequiredSkills;
}
