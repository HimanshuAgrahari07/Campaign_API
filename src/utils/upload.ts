import { fileFilterImage } from "./fileFilters";
const multer = require("multer");
const path = require('path');

/**@ts-ignore */
import * as config from "./../configuration";

const serviceType = {
    contents: {
        path: path.join(__dirname, '../public/contents/'),
        uniquePrefix: config.filesConfig.contents.uniquePrefix || '',
        fileFilter: fileFilterImage
    },
}

type storageType = keyof typeof serviceType;

export function upload(req: Request, file: any, cb: any, storageFor: storageType) {
    const service = serviceType[storageFor]
    if (!service) throw new Error(`${storageFor} is not a valid storage type`)

    const folderPath = service.path;
    const uniquePrefix = service.uniquePrefix

    if (!folderPath) throw new Error('Folder path not found for storage type ' + storageFor)

    console.log({
        folderPath,
        uniquePrefix
    })

    return multer({
        storage: multer.diskStorage({ //multers disk storage settings
            destination: function (req: Request, file: any, cb: any) {
                cb(null, folderPath)
                // cb(null, './')
            },
            filename: function filename(req: Request, file: any, cb: any) {
                const fileName = `${uniquePrefix}--${file.originalname}`;
                console.log(`fileName >>>`, fileName)
                cb(null, fileName)
            }
        }),

        fileFilter: service.fileFilter
    });
}