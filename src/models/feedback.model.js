export default function(sequelize, DataTypes) {
    const feedback = sequelize.define(
        "feedback", // Model Name
        {
            rating: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            requestId: {
                type: DataTypes.INTEGER,
                unique: true,
                primaryKey: true,
            },
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
