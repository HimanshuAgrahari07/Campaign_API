const moment = require("moment");
export enum errorEnums {
  ALREADY_EXIST = "ALREADY_EXIST",
  BAD_QUERY_PARAMETER = "BAD_QUERY_PARAMETER",
  DUPLICATE_ENUM = "DUPLICATE_ENUM",
  DUPLICATE_MESSAGE_ID = "DUPLICATE_MESSAGE_ID",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  NOT_ALLOWED = "NOT_ALLOWED",
  INVALID_PARAMETER = "INVALID_PARAMETER",
  INVALID_TOKEN = "INVALID_TOKEN",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  INVALID_REQUEST = "INVALID_REQUEST",
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  INVALID_TOKEN_TYPE = "INVALID_TOKEN_TYPE",
  INVALID_TOKEN_EXPIRY = "INVALID_TOKEN_EXPIRY",
  INVALID_TOKEN_SIGNATURE = "INVALID_TOKEN_SIGNATURE",
  INVALID_TOKEN_REFRESH = "INVALID_TOKEN_REFRESH",
  INVALID_TOKEN_REFRESH_EXPIRY = "INVALID_TOKEN_REFRESH_EXPIRY",
  INVALID_TOKEN_REFRESH_SIGNATURE = "INVALID_TOKEN_REFRESH_SIGNATURE",
  INVALID_TOKEN_REFRESH_TYPE = "INVALID_TOKEN_REFRESH_TYPE",
  INVALID_TOKEN_REFRESH_USER = "INVALID_TOKEN_REFRESH_USER",
  INVALID_TOKEN_REFRESH_ORG = "INVALID_TOKEN_REFRESH_ORG",
  INVALID_TOKEN_REFRESH_USER_ORG = "INVALID_TOKEN_REFRESH_USER_ORG",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  WRONG_CREDENTIALS = "WRONG_CREDENTIALS",
  UNAUTHORIZED = "UNAUTHORIZED",
  UPDATE_FAILED = "UPDATE_FAILED",
  DELETE_FAILED = "DELETE_FAILED",
  USER_NOT_VERIFIED = "USER_NOT_VERIFIED",
  COLLISION_DETECTED = "COLLISION_DETECTED",
  BAD_REQUEST = "BAD_REQUEST"
}
export const ErrorType = {
  WRONG_CREDENTIAL: {
    statusCode: 403,
    errorEnum: errorEnums.WRONG_CREDENTIALS,
    message: "Please check credentials again",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    errorEnum: errorEnums.UNAUTHORIZED,
    message: "Not allowed.",
  },
  FORBIDDEN: {
    statusCode: 403,
    errorEnum: errorEnums.FORBIDDEN,
    message: "Forbidden.",
  },
  DUPLICATE_ENUM: {
    statusCode: 400,
    errorEnum: errorEnums.DUPLICATE_ENUM,
    message: "Enum has already been used.",
  },
  BAD_QUERY_PARAMETER: {
    statusCode: 400,
    errorEnum: errorEnums.BAD_QUERY_PARAMETER,
    message: "An invalid query parameter value was supplied.",
  },
  DUPLICATE_MESSAGE_ID: {
    statusCode: 420,
    errorEnum: errorEnums.DUPLICATE_MESSAGE_ID,
    message: "This message has already been received.",
  },
  UPDATE_FAILED: {
    statusCode: 500,
    errorEnum: errorEnums.UPDATE_FAILED,
    message: "Update failed.",
  },
  DELETE_FAILED: {
    statusCode: 500,
    errorEnum: errorEnums.DELETE_FAILED,
    message: "Delete failed.",
  },
  USER_NOT_VERIFIED: {
    statusCode: 401,
    errorEnum: errorEnums.USER_NOT_VERIFIED,
    message: "User is not verified. Look for or resend verification email.",
  },
  COLLISION_DETECTED: {
    statusCode: 409,
    errorEnum: errorEnums.COLLISION_DETECTED,
    message: "A collision has been detected. Unable to resolve unique entity.",
  },
  RESOURCE_NOT_FOUND: {
    statusCode: 404,
    errorEnum: errorEnums.RESOURCE_NOT_FOUND,
    message: "A resource was not found. Verify the identifier.",
  },
  BAD_REQUEST: {
    statusCode: 400,
    errorEnum: errorEnums.BAD_REQUEST,
    message: "All the required information should be filled.",
  },
};

export const createError = (
  {
    statusCode,
    errorEnum,
    message,
  }: {
    statusCode: number;
    errorEnum: string;
    message?: string;
  },
  wasThrown: boolean = false,
  stack?: object
) => {
  return {
    statusCode,
    enum: errorEnum,
    message,
    timestamp: moment().unix(),
    wasThrown,
    stack: process.env.NODE_ENV === "production" ? null : stack,
  };
};
