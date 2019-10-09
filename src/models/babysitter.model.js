export default function (sequelize, DataTypes) {
    const babysitter = sequelize.define(
        "babysitter", // Model Name
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            workDate: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            workTime: {
                type: DataTypes.STRING,
                allowNull: true
            },
            MinAgeOfChildren: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            MaxNumOfChildren: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            MaxTravelDistance: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        }, {
            timestamps: true,
        }
    );

    babysitter.associate = function (models) {
        // babysitter.belongsTo(models.user, {
        //     foreignKey: 'userId',
        //     sourceKey: 'id',
        //     as: 'user'
        // });
        // babysitter.hasMany(models.invitation, {
        //     foreignKey: {
        //         name: 'receiver',
        //         allowNull: false
        //     },
        //     sourceKey: 'userId',
        //     as: 'invitation',
        // });

        babysitter.hasMany(models.wishlist, {
            foreignKey: {
                name: 'sittertId',
                allowNull: false
            },
            as: 'wishlists',
            onDelete: 'CASCADE',
        });
    }

    return babysitter;
}
