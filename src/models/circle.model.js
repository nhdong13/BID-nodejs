export default function (sequelize, DataTypes) {
    return sequelize.define(
        "circle", // Model Name
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            timestamps: true,
        }
    );
}
