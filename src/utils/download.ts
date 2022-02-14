import { Response, Request } from "express";

const fs = require('fs');
const request = require('request');

export const download = (res: Response, filePath: string) => {
    res.download(, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  };