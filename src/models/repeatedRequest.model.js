export default function(sequelize, DataTypes) {
    const repeatedRequest = sequelize.define(
        'repeatedRequest', // Model Name
        {
            startDate: {
                type: DataTypes.STRING,
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
            repeatedDays: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'CANCELED'),
                allowNull: false,
            },
            actualDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            childrenDescription: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            skills: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            certs: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    repeatedRequest.associate = function(models) {
        // request - invitation
        repeatedRequest.hasMany(models.sittingRequest, {
            foreignKey: {
                name: 'repeatedRequestId',
                allowNull: false,
            },
            sourceKey: 'id',
        });

        // request - user(parent)
        repeatedRequest.belongsTo(models.user, {
            foreignKey: {
                name: 'createdUser',
            },
            sourceKey: 'id',
            as: 'user',
        });
    };

    return repeatedRequest;
}
