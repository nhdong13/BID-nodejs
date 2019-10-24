export default function(sequelize, DataTypes) {
    const sittingRequest = sequelize.define(
        "sittingRequest", // Model Name
        {
            acceptedBabysitter: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            childrenNumber: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            minAgeOfChildren: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            sittingDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            startTime: {
                type: DataTypes.TIME,
                allowNull: false
            },
            endTime: {
                type: DataTypes.TIME,
                allowNull: false
            },
            sittingAddress: {
                type: DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM(
                    "PENDING",
                    "CONFIRMED",
                    "CANCELED",
                    "ONGOING",
                    "DONE",
                    "BS_FINISH"
                ),
                allowNull: false
            },
            canCheckIn: DataTypes.VIRTUAL,
            canCheckOut: DataTypes.VIRTUAL,
        },
        {
            timestamps: true,
            charset: "utf8",
            collate: "utf8_general_ci"
        }
    );

    sittingRequest.associate = function(models) {
        // request - invitation
        sittingRequest.hasMany(models.invitation, {
            foreignKey: {
                name: "requestId",
                allowNull: false
            },
            sourceKey: "id"
        });

        // request - transaction
        sittingRequest.hasMany(models.transaction, {
            foreignKey: {
                name: "requestId",
                allowNull: false
            },
            sourceKey: "id"
        });

        // request - report
        sittingRequest.hasMany(models.report, {
            foreignKey: {
                name: "requestId",
                allowNull: false
            },
            sourceKey: "id"
        });

        // request - feedback
        sittingRequest.hasMany(models.feedback, {
            foreignKey: {
                name: "requestId",
                allowNull: false
            },
            sourceKey: "id"
        });

        sittingRequest.belongsTo(models.user, {
            foreignKey: {
                name: "createdUser"
            },
            sourceKey: "id",
            as: "user"
        });

        sittingRequest.belongsTo(models.user, {
            foreignKey: {
                name: "acceptedBabysitter"
            },
            sourceKey: "id",
            as: "bsitter"
        });
    };

    return sittingRequest;
}
