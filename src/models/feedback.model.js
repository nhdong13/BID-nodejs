export default function (sequelize, DataTypes) {
    const feedback = sequelize.define(
        "feedback", // Model Name
        {
            rating: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
        }, {
            timestamps: true,
        }
    );

    feedback.associate = function (models) {
        
    }

    return feedback;
}
