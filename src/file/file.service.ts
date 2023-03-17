import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';
import { FileType, Exception500, ImageSizes } from '../types/enums';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uidv4 } from 'uuid';
import { STATIC_FILES_DIR } from '../constants/env';
import { SharpType } from '../types/types';

@Injectable()
export class FileService {
  async createImageWebP(
    file: Express.Multer.File,
    type: FileType,
  ): Promise<SharpType> {
    try {
      const { absolutePath, relativePath } = this.createUploadPath(type);
      const image: SharpType = {
        name: `${uidv4()}.webp`,
        format: 'webp',
        path: [],
      };

      for (const [name, size] of Object.entries(ImageSizes)) {
        let sharpFn: sharp.Sharp;
        const fileName = `${size}-${image.name}`;
        const imagePath = path.join(absolutePath, fileName);

        if (name === ImageSizes.origin) {
          sharpFn = sharp(file.buffer);
        } else {
          sharpFn = sharp(file.buffer).resize(
            // просо достаем размеры изображения
            ...size.split('x').map(Number),
          );
        }
        await sharpFn.webp({ effort: 3, quality: 80 }).toFile(imagePath);

        image.path.push(`${relativePath}/${fileName}`);
      }

      return image;
    } catch (e) {
      throw new InternalServerErrorException(
        Exception500.uploadFile + '. ' + e.message,
      );
    }
  }

  createFileMap(file: Express.Multer.File, type: FileType): string {
    try {
      const { absolutePath, relativePath } = this.createUploadPath(type);
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uidv4() + '.' + fileExtension;

      fs.writeFileSync(path.resolve(absolutePath, fileName), file.buffer);

      return `${relativePath}/${fileName}`;
    } catch (e) {
      throw new InternalServerErrorException(
        Exception500.uploadFile + '. ' + e.message,
      );
    }
  }

  removeFile(paths: string[]) {
    try {
      paths.forEach((path) => {
        const filePath = `${__dirname}/../${STATIC_FILES_DIR}/${path}`;

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (e) {
      throw new InternalServerErrorException(
        Exception500.removeFile + '. ' + e.message,
      );
    }
  }

  // UTILS
  createUploadPath(type: FileType) {
    const date = new Date();

    const relativePath = path.join(
      `${date.getFullYear()}-${date.getMonth() + 1}`,
      type,
    );
    const absolutePath = path.resolve(
      __dirname,
      '..',
      STATIC_FILES_DIR,
      relativePath,
    );

    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath, { recursive: true });
    }

    return { absolutePath, relativePath };
  }
}
