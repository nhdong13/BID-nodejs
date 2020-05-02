export default function(sequelize, DataTypes) {
    const sitterSkill = sequelize.define(
        'sitterSkill', // Model Name
        {
            sitterId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            skillId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    sitterSkill.associate = function(models) {
        sitterSkill.belongsTo(models.user, {
            foreignKey: {
                name: 'sitterId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'user',
            onDelete: 'CASCADE',
        });

        sitterSkill.belongsTo(models.skill, {
            foreignKey: {
                name: 'skillId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'skill',
            onDelete: 'CASCADE',
        });
    };

    return sitterSkill;
}
