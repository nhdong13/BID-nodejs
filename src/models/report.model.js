export default function(sequelize, DataTypes) {
    const report = sequelize.define(
        "report", // Model Name
        {
            description: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            timestamps: true,
            charset: "utf8",
            collate: "utf8_general_ci"
        }
    );

    report.associate = function(models) {};

    return report;
}
