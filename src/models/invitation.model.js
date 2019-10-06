export default function(sequelize, DataTypes) {
    const invitation = sequelize.define(
        "invitation", // Model Name
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
            isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                onUpdate: DataTypes.NOW
            }
        }
    );

    invitation.associate = function (models) {
        models.invitation.hasOne(models.babysitter);
    }

    return invitation;
}
