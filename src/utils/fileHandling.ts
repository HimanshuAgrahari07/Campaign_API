import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { createError, ErrorType } from '../errors/createError';
import { SuccessResponse } from './const';

export const downloadFile = async (fileName: string, folderPath: string, response: Response, next: NextFunction) => {
    const filePath = folderPath + fileName
    console.log(`filePath: ${filePath}`);

    response.download(filePath, fileName, (err) => {
        if (err) {
            next(createError(ErrorType.RESOURCE_NOT_FOUND))
        }
    })
}


export const deleteFile = async (filePath: string) => {
    console.log(`filePath: ${filePath}`);
    fs.unlinkSync(filePath)
}