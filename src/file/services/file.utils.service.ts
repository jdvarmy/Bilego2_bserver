import { Injectable } from '@nestjs/common';
import { FileType } from '../../utils/types/enums';
import path from 'path';
import { STATIC_FILES_DIR } from '../../utils/types/constants/env';
import fs from 'fs';
import { mainDir } from '../../main';

@Injectable()
export class FileUtilsService {
  createUploadPath(type: FileType) {
    const date = new Date();
    const datePath = `${date.getFullYear()}-${date.getMonth() + 1}`;

    const relativePath = datePath + '/' + type;
    const absolutePath = path.resolve(
      mainDir,
      STATIC_FILES_DIR,
      datePath,
      type,
    );

    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }

    return { absolutePath, relativePath };
  }
}
