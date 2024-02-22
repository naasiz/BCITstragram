const unzipper = require("yauzl-promise");
const fs = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut }))
      .on("error", reject)
      .on("finish", () => {
        console.log("Extraction operation complete");
        resolve();
      });
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} dir
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const pngFiles = files.filter((file) => path.extname(file) === ".png");
      const filePaths = pngFiles.map((file) => path.join(dir, file));
      resolve(filePaths);
    });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(new PNG())
      .on("parsed", function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const gray = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = gray;
            this.data[idx + 1] = gray;
            this.data[idx + 2] = gray;
          }
        }
        this.pack().pipe(fs.createWriteStream(pathOut))
          .on("finish", resolve)
          .on("error", reject);
      })
      .on("error", reject);
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
