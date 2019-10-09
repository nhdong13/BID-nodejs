export default function (sequelize, DataTypes) {
    const invitation = sequelize.define(
        "invitation", // Model Name
        {
            status: {
                type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'DENIED'),
                allowNull: false,
            },
        }, {
            timestamps: true,
        }
    );

    invitation.associate = function (models) {
        // invitation.belongsTo(models.sittingRequest, {
        //     foreignKey: {
        //         name: 'sittingRequestId',
        //         allowNull: false
        //     },
        //     sourceKey: 'id',
        //     as: 'sittingRequest',
        //     onDelete: 'CASCADE'
        // });
        
        // invitation.belongsTo(models.babysitter, {
        //     foreignKey: {
        //         name: 'receiver',
        //         allowNull: false
        //     },
        //     sourceKey: 'userId',
        //     as: 'babysitter',
        //     onDelete: 'CASCADE'
        // })
    }

    return invitation;
}
