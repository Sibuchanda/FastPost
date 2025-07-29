import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please Login - No such auth header",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decodeValue = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodeValue || !decodeValue.user) {
            res.status(401).json({
                message: "Invalid token"
            });
            return;
        }
        req.user = decodeValue.user;
        next();
    }
    catch (err) {
        res.status(401).json({
            message: "Please Login - JWT error"
        });
    }
};
