export default function(sequelize, DataTypes) {
    return sequelize.define(
        "circle", // Model Name
        {
            // this is a reference table with only foreign key from parent
        },
        {
            timestamps: true,
            charset: "utf8",
            collate: "utf8_general_ci"
        }
    );
}
