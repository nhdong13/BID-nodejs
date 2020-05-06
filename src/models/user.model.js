export default function (sequelize, DataTypes) {
    const user = sequelize.define(
        'user', // Model Name
        {
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            gender: {
                type: DataTypes.ENUM('MALE', 'FEMALE'),
                // allowNull: false,
            },
            dateOfBirth: {
                type: DataTypes.DATEONLY,
                // allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            image: {
                type: DataTypes.TEXT('long'),
                allowNull: true,
            },
            firstTime: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            secret: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cardId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            latlog: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            defaultScope: {
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt', 'latlog'],
                },
            },
        },
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

        // user - sittingRequest
        user.hasMany(models.sittingRequest, {
            foreignKey: {
                name: 'acceptedBabysitter',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'requests',
            onDelete: 'CASCADE',
        });

        // user - invitation
        user.hasMany(models.invitation, {
            foreignKey: {
                name: 'receiver',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'invitations',
        });

        // user - transaction
        user.hasMany(models.transaction, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'transactions',
        });

        // user - tracking
        user.hasOne(models.tracking, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'tracking',
        });

        // user - schedule
        user.hasMany(models.schedule, {
            foreignKey: {
                name: 'userId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'schedules',
            onDelete: 'CASCADE',
        });

        // user - skill
        user.hasMany(models.sitterSkill, {
            foreignKey: {
                name: 'sitterId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'sitterSkills',
            onDelete: 'CASCADE',
        });

        // user - cert
        user.hasMany(models.sitterCert, {
            foreignKey: {
                name: 'sitterId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'sitterCerts',
            onDelete: 'CASCADE',
        });

        // user - circle
        user.hasMany(models.circle, {
            foreignKey: {
                name: 'ownerId',
                allowNull: false,
            },
            as: 'ownedCircles',
            onDelete: 'CASCADE',
        });

        //
        user.hasMany(models.circle, {
            foreignKey: {
                name: 'friendId',
                allowNull: false,
            },
            as: 'joinedCircles',
            onDelete: 'CASCADE',
        });
    };

    return user;
}
