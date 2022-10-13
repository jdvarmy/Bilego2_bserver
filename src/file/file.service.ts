import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileType, Exception500 } from '../types/enums';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uidv4 } from 'uuid';
import { STATIC_FILES_DIR } from '../constants/env';

@Injectable()
export class FileService {
  createFile(type: FileType, file): string {
    const d = new Date();
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uidv4() + '.' + fileExtension;
      const filePath = path.resolve(
        __dirname,
        '..',
        STATIC_FILES_DIR,
        `${d.getFullYear()}-${d.getMonth() + 1}`,
        type,
      );

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

      return `${d.getFullYear()}-${d.getMonth() + 1}/${type}/` + fileName;
    } catch (e) {
      throw new InternalServerErrorException(
        Exception500.uploadFile + '. ' + e.message,
      );
    }
  }

  removeFile(path: string) {
    try {
      const filePath = `${__dirname}/../${STATIC_FILES_DIR}/${path}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      throw new InternalServerErrorException(
        Exception500.removeFile + '. ' + e.message,
      );
    }
  }
}
