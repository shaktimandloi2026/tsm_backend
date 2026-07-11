import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { getUploadDir } from '../config/uploads';

function ensureUploadDir(dir: string) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.warn('Upload directory is not writable:', error);
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = getUploadDir();
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf|doc|docx/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  cb(null, ext && mime);
};

export const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSize },
  fileFilter,
});
