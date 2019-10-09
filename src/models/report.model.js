export default function (sequelize, DataTypes) {
    const report = sequelize.define(
        "report", // Model Name
        {
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
        }, {
            timestamps: true,
        }
    );

    report.associate = function (models) {
        
    }

    return report;
}
