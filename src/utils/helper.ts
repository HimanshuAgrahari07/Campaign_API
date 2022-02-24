export const getLocalStrTime = (time: string) => {
    return new Date(time).toLocaleString()
}

export const byteToMb = (byte: number) => {
    return byte / 1000000;
}

import * as crypto from "crypto";
export const getHashedPassword = (password: string) => {
    return crypto.createHash("sha256").update(password).digest("hex");
}