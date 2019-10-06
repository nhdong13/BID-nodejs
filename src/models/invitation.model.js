export default function (sequelize, DataTypes) {
    const invitation = sequelize.define(
        "invitation", // Model Name
        {
            sittingRequestId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            sender: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            receiver: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'DENIED'),
                allowNull: false,
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

    }

    return invitation;
}
