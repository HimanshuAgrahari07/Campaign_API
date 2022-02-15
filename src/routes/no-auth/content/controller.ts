import { Request, Response, NextFunction } from 'express';
import * as fileHandling from '../../../utils/fileHandling';
//@ts-ignore
import * as config from '../../../configuration';

export const download = async (request: Request, response: Response, next: NextFunction) => {
    const fileName = request.params.filePath;
    const folderPath = config.filesConfig.contents.path;
    return fileHandling.downloadFile(fileName, folderPath, response, next);
}