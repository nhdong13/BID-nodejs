export default function (sequelize, DataTypes) {
    const skill = sequelize.define(
        "skill", // Model Name
        {
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            point: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        }
    );

    skill.associate = function (models) {
        // skill - user
        // skill.hasMany(models.user, {
        //     foreignKey: {
        //         name: 'skillId',
        //     },
        //     sourceKey: 'id',
        // });
    }

    return skill;
}

