export default function(sequelize, DataTypes) {
    const feedback = sequelize.define(
        "feedback", // Model Name
        {
            requestId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // unique: 'uniqueTag',
            },
            reporter: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                // unique: 'uniqueTag',
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isReport: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                // unique: 'uniqueTag',
            },
            status: {
                type: DataTypes.ENUM('Solved', 'Unsolve'),
                allowNull: true
            },
            image: {
                type: DataTypes.TEXT('long'),
                allowNull: true
            },
            order: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            timestamps: true,
            charset: "utf8",
            collate: "utf8_general_ci"
        }
    );

    feedback.associate = function(models) {
        feedback.belongsTo(models.sittingRequest, {
            foreignKey: {
                name: "requestId",
            },
            sourceKey: "id",
            as: "sitting",
            onDelete: "CASCADE"
        });
    };

    return feedback;
}
