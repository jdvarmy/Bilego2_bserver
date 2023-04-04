import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from '../../typeorm';
import { Repository } from 'typeorm';
import { MediaDto } from '../dtos/Media.dto';
import { FileService } from '../../file/services/file.service';
import { FileType } from '../../utils/types/enums';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';
import { ItemsPageProps, PostOptions } from '../../utils/types/types';
import { DatabaseService } from '../../database/database.service';

const scope = 'media';

@Injectable()
export class MedialibraryService {
  constructor(
    private readonly fileService: FileService,
    private readonly databaseService: DatabaseService,

    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) {}

  async fetchMedia(
    options: PostOptions,
  ): Promise<{ items: MediaDto[]; props: ItemsPageProps }> {
    const query = await this.mediaRepo
      .createQueryBuilder(scope)
      .select([
        `${scope}.id`,
        `${scope}.name`,
        `${scope}.originalName`,
        `${scope}.path`,
        `${scope}.mimetype`,
        `${scope}.size`,
        `${scope}.s3location`,
        `${scope}.s3key`,
      ])
      .where(`${scope}.mimetype = :mime`, { mime: 'webp' })
      .orderBy(`${scope}.id`, 'DESC')
      .skip(options.offset)
      .take(options.count);

    const media = await query.getMany();

    return {
      items: plainToClassResponse(MediaDto, media),
      props: {
        total: await this.databaseService.getTotal(options.filter, scope),
        offset: +options.offset + +options.count,
      },
    };
  }

  async insertMediaData(files: Express.Multer.File[]): Promise<boolean> {
    for (const file of files) {
      await this.saveImage(file, FileType.image);
    }

    return true;
  }

  async deleteMediaData(id: number): Promise<Media> {
    const media = await this.mediaRepo.findOne({ where: { id } });
    const deleteMedia = await this.mediaRepo.remove(media);

    this.fileService.removeFile(JSON.parse(media.path));
    this.fileService.removeFilesFromS3(JSON.parse(media.s3key));

    return deleteMedia;
  }

  async saveImage(file: Express.Multer.File, type: FileType) {
    const image = await this.fileService.createImageWebP(file, type);

    const media = this.mediaRepo.create({
      name: image.name,
      originalName: file.originalname,
      mimetype: image.format,
      size: file.size,
      path: JSON.stringify(image.path),
      s3location: JSON.stringify(image.s3location),
      s3key: JSON.stringify(image.s3key),
    });

    return this.mediaRepo.save(media);
  }

  async saveMediaMap(file: Express.Multer.File): Promise<Media> {
    const imagePath = this.fileService.createFileMap(file, FileType.map);

    const media = this.mediaRepo.create({
      originalName: file.originalname,
      path: JSON.stringify(imagePath),
      mimetype: file.mimetype,
      size: file.size,
    });

    return this.mediaRepo.save(media);
  }
}
