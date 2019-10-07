export default function (sequelize, DataTypes) {
    const invitation = sequelize.define(
        "invitation", // Model Name
        {
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
