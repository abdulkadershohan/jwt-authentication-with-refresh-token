import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const createToken = (
    payload: any,
    keyType: "ACCESS" | "REFRESH" | "OTP"
) => {
    if (keyType === "ACCESS") {
        return jwt.sign(payload, process.env.JWT_SECRET_AUTH_TOKEN!, {
            expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN! || "1",
        });
    } else if (keyType === "REFRESH") {
        return jwt.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN!, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN! || "7d",
        });
    }

    return jwt.sign(payload, process.env.OTP_TOKEN!, {
        expiresIn: process.env.OTP_TOKEN_EXPIRES_IN! || "5m",
    });
};
