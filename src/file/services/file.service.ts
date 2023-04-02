import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import sharp from 'sharp';
import { FileType, Exception500, ImageSizes } from '../../utils/types/enums';
import path from 'path';
import fs from 'fs';
import { v4 as uidv4 } from 'uuid';
import { STATIC_FILES_DIR } from '../../utils/types/constants/env';
import { SharpType } from '../../utils/types/types';
import { FileUtilsService } from './file.utils.service';
import { FileS3Service } from './file.s3.service';
import { mainDir } from '../../main';

@Injectable()
export class FileService {
  constructor(
    @Inject(FileUtilsService)
    private readonly fileUtilsService: FileUtilsService,

    @Inject(FileS3Service)
    private readonly fileS3Service: FileS3Service,
  ) {}

  async createImageWebP(
    file: Express.Multer.File,
    type: FileType,
  ): Promise<SharpType> {
    try {
      const { absolutePath, relativePath } =
        this.fileUtilsService.createUploadPath(type);
      const image: SharpType = {
        name: `${uidv4()}.webp`,
        format: 'webp',
        path: [],
        s3location: [],
        s3key: [],
      };

      for (const [name, size] of Object.entries(ImageSizes)) {
        let sharpFn: sharp.Sharp;
        const fileName = `${size}-${image.name}`;
        const imagePath = path.join(absolutePath, fileName);

        if (name === ImageSizes.origin) {
          sharpFn = sharp(file.buffer);

          await sharpFn.webp({ effort: 3, quality: 80 }).toFile(imagePath);
        } else {
          sharpFn = sharp(file.buffer).resize(
            // просо достаем размеры изображения
            ...size.split('x').map(Number),
          );
        }

        const buffer = await sharpFn
          .webp({ effort: 3, quality: 80 })
          .toBuffer();
        const { Location, Key } = await this.fileS3Service
          .saveToS3(buffer, fileName, relativePath)
          .promise();

        image.path.push(`${relativePath}/${fileName}`);
        image.s3location.push(Location);
        image.s3key.push(Key);
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
      const { absolutePath, relativePath } =
        this.fileUtilsService.createUploadPath(type);
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
      paths.forEach((p) => {
        const filePath = path.resolve(mainDir, STATIC_FILES_DIR, p);

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

  removeFilesFromS3(keys: string[]) {
    try {
      if (!keys || !Array.isArray(keys) || !keys.length) {
        return;
      }

      this.fileS3Service.removeFromS3(keys);
    } catch (e) {
      throw new InternalServerErrorException(
        Exception500.uploadFile + '. ' + e.message,
      );
    }
  }
}
