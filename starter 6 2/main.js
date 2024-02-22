const path = require("path");

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => {
    return IOhandler.readDir(pathUnzipped);
  })
  .then((filePaths) => {
    const grayScalePromises = filePaths.map((filePath) => {
      const fileName = path.basename(filePath);
      const outputPath = path.join(pathProcessed, fileName);
      return IOhandler.grayScale(filePath, outputPath);
    });
    return Promise.all(grayScalePromises);
  })
  .then(() => {
    console.log("Grayscale conversion complete");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
