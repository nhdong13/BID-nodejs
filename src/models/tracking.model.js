export default function (sequelize, DataTypes) {
    return sequelize.define(
        "tracking", // Model Name
        {
            userAgent: {
                type: DataTypes.STRING,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            timestamps: true,
        }
    );
}
