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
        },
        {
            timestamps: true,
        }
    );

    invitation.associate = function (models) {

    }

    return invitation;
}
