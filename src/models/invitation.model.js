export default function(sequelize, DataTypes) {
    const invitation = sequelize.define(
        'invitation', // Model Name
        {
            status: {
                type: DataTypes.ENUM(
                    'PENDING',
                    'ACCEPTED',
                    'DENIED',
                    'EXPIRED',
                    'CONFIRMED',
                    'OVERLAP',
                    'PARENT_CANCELED',
                    'ONGOING',
                    'DONE',
                ),
                allowNull: false,
            },
            requestId: {
                type: DataTypes.INTEGER,
                unique: 'compositeIndex',
            },
            receiver: {
                type: DataTypes.INTEGER,
                unique: 'compositeIndex',
            },
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    invitation.associate = function(models) {
        invitation.belongsTo(models.sittingRequest, {
            foreignKey: {
                name: 'requestId',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'sittingRequest',
            onDelete: 'CASCADE',
        });

        invitation.belongsTo(models.user, {
            foreignKey: {
                name: 'receiver',
                allowNull: false,
            },
            sourceKey: 'id',
            as: 'user',
            onDelete: 'CASCADE',
        });
    };

    return invitation;
}
