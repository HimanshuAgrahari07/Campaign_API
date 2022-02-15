import { fileFilterImage } from "./fileFilters";
const multer = require("multer");

/**@ts-ignore */
import * as config from "./../configuration";

const serviceType = {
    contents: {
        path: config.filesConfig.contents.path,
        fileFilter: fileFilterImage
    },
}

type storageType = keyof typeof serviceType;

export function upload(storageFor: storageType) {
    const service = serviceType[storageFor]
    if (!service) throw new Error(`${storageFor} is not a valid storage type`)

    const folderPath = service.path;

    if (!folderPath) throw new Error('Folder path not found for storage type ' + storageFor)

    return multer({
        storage: multer.diskStorage({ //multers disk storage settings
            destination: function (req: Request, file: any, cb: any) {
                cb(null, folderPath)
            },
            filename: function filename(req: Request, file: any, cb: any) {
                const fileName = `${Date.now() + '--' + Math.round(Math.random() * 1E9)}--${file.originalname}`;
                cb(null, fileName)
            }
        }),

        fileFilter: service.fileFilter
    });
}