import formidable from "formidable";
import path from "path";
import os from "os";

const tempDir = os.tmpdir();

const UploadFile = async (req, saveLocally, filename) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/assets/usuarios");
    options.filename = (name, ext, path, form) => {
      if (filename) return filename + "." + path.originalFilename.split('.')[1];
      else return Date.now().toString() + "_" + path.originalFilename;
    };
  } else {
    options.uploadDir = tempDir;
    options.filename = (name, ext, path, form) => {
      if (filename) return filename + "." + path.originalFilename.split('.')[1];
      else return Date.now().toString() + "_" + path.originalFilename;
    };
  }

  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export { UploadFile }