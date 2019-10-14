export default function (sequelize, DataTypes) {
    const user = sequelize.define(
        "user", // Model Name
        {
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
        }, {
            timestamps: true,
        }
    );

    user.associate = function (models) {
        // user - parent
        user.hasOne(models.parent, {
            foreignKey: 'userId',
            as: 'parent',
            onDelete: 'CASCADE',
        });

        // user - babysitter
        user.hasOne(models.babysitter, {
            foreignKey: 'userId',
            as: 'babysitter',
            onDelete: 'CASCADE',
        });

        // user - sittingRequest
        user.hasMany(models.sittingRequest, {
            foreignKey: {
                name: 'createdUser',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'sittingRequests',
            onDelete: 'CASCADE',
        });

        // user - invitation
        user.hasMany(models.invitation, {
            foreignKey: {
                name: 'receiver',
                allowNull: false,
                unique: false,
            },
            sourceKey: 'id',
            as: 'invitations',
        });

        // user - transaction
        user.hasMany(models.transaction, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
                unique: false,
            },
            sourceKey: 'id',
            as: 'transactions',
        });
    }

    return user;
}
