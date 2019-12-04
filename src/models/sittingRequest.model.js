export default function(sequelize, DataTypes) {
    const sittingRequest = sequelize.define(
        'sittingRequest', // Model Name
        {
            acceptedBabysitter: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            childrenNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            minAgeOfChildren: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            sittingDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            startTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            endTime: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            sittingAddress: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            totalPrice: {
                type: DataTypes.INTEGER,
            },
            status: {
                type: DataTypes.ENUM(
                    'PENDING',
                    'CONFIRMED',
                    'CANCELED',
                    'ONGOING',
                    'DONE',
                    'DONE_UNCONFIMRED',
                    'DONE_BY_NEWSTART',
                    'SITTER_NOT_CHECKIN',
                    'EXPIRED',
                ),
                allowNull: false,
            },
            distance: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            canCheckIn: DataTypes.VIRTUAL,
            canCheckOut: DataTypes.VIRTUAL,
            checkinTime: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            checkoutTime: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    sittingRequest.associate = function(models) {
        // request - invitation
        sittingRequest.hasMany(models.invitation, {
            foreignKey: {
                name: 'requestId',
                allowNull: false,
            },
            sourceKey: 'id',
        });

        // request - transaction
        sittingRequest.hasMany(models.transaction, {
            foreignKey: {
                name: 'requestId',
                allowNull: false,
            },
            sourceKey: 'id',
        });

        // request - feedback
        sittingRequest.hasMany(models.feedback, {
            foreignKey: {
                name: 'requestId',
                allowNull: false,
            },
            sourceKey: 'id',
        });

        // request - user(parent)
        sittingRequest.belongsTo(models.user, {
            foreignKey: {
                name: 'createdUser',
            },
            sourceKey: 'id',
            as: 'user',
        });

        // request - user(sitter)
        sittingRequest.belongsTo(models.user, {
            foreignKey: {
                name: 'acceptedBabysitter',
            },
            sourceKey: 'id',
            as: 'bsitter',
        });

        // request - schedule
        sittingRequest.hasMany(models.schedule, {
            foreignKey: {
                name: 'requestId',
            },
            sourceKey: 'id',
        });
    };

    return sittingRequest;
}
