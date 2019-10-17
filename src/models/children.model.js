export default function(sequelize, DataTypes) {
    const children = sequelize.define(
        "children", // Model Name
        {
            name: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            age: {
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

    children.associate = function(models) {};

    return children;
}
