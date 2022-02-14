import { Router, NextFunction, Request, Response } from 'express';
import * as path from "path";

// images
const acceptableMimeTypesImages = ["image/png", "image/jpg", "image/jpeg"];
const acceptableExtensionsImages = [".png", ".jpg", ".jpeg"];

// Not working properly
export function fileFilterImage(req: Request, file: any, cb: any) {
  console.log(`file >>> `, file)
  const isValidFileType = acceptableMimeTypesImages.includes(file.mimetype) ||
    acceptableExtensionsImages.includes(path.extname(file.originalname))

  console.log('isValidFileType >> ', isValidFileType)
  if (isValidFileType) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file"));
  }
}