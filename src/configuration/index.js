module.exports = {
    port: process.env.PORT || 3001,
    jwt: {
        user: {
            secret:
                process.env.USER_TOKEN_SECRET || "jwt-test",
            expiration: process.env.USER_TOKEN_EXPIRATION || 3600 * 24 * 30,
            refreshSecret:
                process.env.USER_REFRESH_TOKEN_SECRET ||
                "jwt-test-refresh",
            refreshExpiration:
                process.env.USER_REFRESH_TOKEN_EXPIRATION || 3600 * 24 * 365 * 2,
        },
        forgotPassword: {
            secret:
                process.env.FORGOT_PASSWORD_TOKEN_SECRET ||
                "jwt-test-forgot-password",
            expiration: process.env.FORGOT_PASSWORD_TOKEN_EXPIRATION || 1800, // 30 min
        },
        verifyEmail: {
            secret:
                process.env.VERIFY_EMAIL_TOKEN_SECRET ||
                "jwt-test-verify-email",
            expiration: process.env.VERIFY_EMAIL_TOKEN_EXPIRATION || 3600 * 24 * 30, // 1 month
        },
    },
    database: {
        mariadb: {
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "root123",
            host: process.env.DB_HOST || "127.0.0.1",
            port: process.env.DB_PORT || 3307,
            database: process.env.DB_NAME || "dhipromo",
            maxConnections: process.env.DB_MAX_CONNECTIONS || 5
        },
    },
    filesConfig: {
        contents: {
            // path: process.env.CONTENTS_PATH || "../../public/contents",
            uniquePrefix: Date.now() + '--' + Math.round(Math.random() * 1E9),
            uniqueSuffix: '',
        }
    }
};
