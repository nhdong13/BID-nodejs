export default function(sequelize, DataTypes) {
    const schedule = sequelize.define(
        "schedule", // Model Name
        {
            scheduleTime: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE'),
                allowNull: false
            }
        },
        {
            timestamps: true,
            charset: "utf8",
            collate: "utf8_general_ci"
        }
    );

    schedule.associate = function(models) {
        // user - schedule
        schedule.belongsTo(models.user, {
            foreignKey: "userId",
            sourceKey: "id",
            as: "user"
        });
    };

    return schedule;
}
