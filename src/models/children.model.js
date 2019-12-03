export default function(sequelize, DataTypes) {
    const children = sequelize.define(
        "children", // Model Name
        {
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            age: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            image: {
                type: DataTypes.TEXT('long'),
                allowNull: true
            },
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
