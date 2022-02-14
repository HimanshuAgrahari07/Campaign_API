import { Router, NextFunction, Request, Response } from 'express';
import * as path from "path";

// images
const acceptableMimeTypesImages = ["image/png", "image/jpg", "image/jpeg"];
const acceptableExtensionsImages = [".png", ".jpg", ".jpeg"];

export function fileFilterImage(req: Request, file: any, cb: NextFunction) {
  console.log(`file >>> `, file)
  if (
    acceptableMimeTypesImages.includes(file.mimetype) ||
    acceptableExtensionsImages.includes(path.extname(file.originalname))
  ) {
    cb();
  } else {
    cb(new Error("Invalid file"));
  }
}