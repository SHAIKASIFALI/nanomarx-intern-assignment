const express = require("express");

const {
  httpCreateFile,
  httpDeleteFile,
  httpCutFile,
  httpCopyFile,
  httpGetAllFiles,
  httpUpdateFile,
} = require("../../controller/fileController");

const fileRouter = express.Router();
// POST /host/api/files
// Payload directoryPath : string  ex: /root/svu/cse/12006051
//         fileName : string ex: asif.txt
//         fileSize : integer ex : 1024

fileRouter.post("/", httpCreateFile);

// POST /host/api/files/cut
// payload filePath : string ex: /root/svu/cse/12006051/asif.txt
//         destinationDirectoryPath : string ex:/root/svu/cse

fileRouter.post("/cut", httpCutFile);

// POST /host/api/files/copy
// payload filePath : string ex: /root/svu/cse/12006051/asif.txt
//         destinationDirectoryPath : string ex:/root/svu/cse

fileRouter.post("/copy", httpCopyFile);

// GET /host/api/files
//    queryParameters = minFileSize , maxFileSize , type
fileRouter.get("/", httpGetAllFiles);

// PATCH /host/api/files
// PAYLOAD filePath : String ex: /root/svu/cse/12006051/asif.txt
//          fileName : String ex :asif1.txt (or)
//          fileSize : Number ex : 12004
fileRouter.patch("/update", httpUpdateFile);

// DELETE /host/api/files
// payload path : string ex : /root/svu/cse/12006051/asif.txt
fileRouter.delete("/", httpDeleteFile);

module.exports = fileRouter;
