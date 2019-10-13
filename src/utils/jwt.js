import jwt from "jsonwebtoken";

export function createJWT(id, roleId) {
    return jwt.sign(
        {
            data: {
                id: id,
                roleId: roleId,
            }
        },
        "fuckthisshit",
        { expiresIn: "24h" }
    );
}

export function verifyJWT(token) {
    return jwt.verify(token, "fuckthisshit");
}
