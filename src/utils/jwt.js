import jwt from "jsonwebtoken";

export function createJWT(id) {
    return jwt.sign(
        {
            data: id
        },
        "fuckthisshit",
        { expiresIn: "24h" }
    );
}

export function verifyJWT(token) {
    return jwt.verify(token, "fuckthisshit");
}
