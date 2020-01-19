export default function(sequelize, DataTypes) {
    const sitterSkill = sequelize.define(
        'sitterSkill', // Model Name
        {
            sitter: {
                type: DataTypes.INTEGER,
                unique: 'compositeIndex',
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            weight: {
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

    // sitterSkill.associate = function(models) {
    //     sitterSkill.belongsTo(models.user, {
    //         foreignKey: {
    //             name: 'sitterSkill',
    //             allowNull: false,
    //         },
    //         sourceKey: 'id',
    //         as: 'user',
    //         onDelete: 'CASCADE',
    //     });
    // };

    return sitterSkill;
}
