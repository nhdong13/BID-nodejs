export default function(sequelize, DataTypes) {
    // list criteria
    /*
    1 - BABYSITTING
    2 - CHILDREN WITH DISABILITIES
    3 - GIVING A BATH
    4 - HELP WITH HOMEWORK
    5 - SICK CHILDREN
    6 - COOOKING
    7 - PSC1
    8 - 
     */

    const criteria = sequelize.define(
        'criteria', // Model Name
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            type: {
                type: DataTypes.INTEGER,
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

    // sittingRequestSkill.associate = function(models) {
    //     sittingRequestSkill.belongsTo(models.sittingRequest, {
    //         foreignKey: {
    //             name: 'requestId',
    //             allowNull: false,
    //         },
    //         sourceKey: 'id',
    //         as: 'sittingRequest',
    //         onDelete: 'CASCADE',
    //     });
    // };

    return criteria;
}
