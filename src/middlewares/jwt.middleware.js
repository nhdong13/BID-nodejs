import { verifyJWT } from "@utils/jwt";

// Format of token 
// Authorization: Bearer <access_token>

export function jwtAuthentication(req, res, next) {
    const token = getToken(req);

    try {
        const payload = verifyJWT(token);
        const { data } = payload;
        req.userId = data.id;
        req.roleId = data.roleId;
        next();
    } catch (err) {
        res.status(401);
        res.send({ message: "Unauthorized" });
    }
}

function getToken(req) {
    // From header or query string
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }

    return null;
}
