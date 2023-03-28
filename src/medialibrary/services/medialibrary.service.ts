import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from '../../typeorm';
import { Repository } from 'typeorm';
import { MediaDto } from '../dtos/Media.dto';
import { FileService } from '../../file/file.service';
import { FileType } from '../../utils/types/enums';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';
import { PostOptions } from '../../utils/types/types';

@Injectable()
export class MedialibraryService {
  constructor(
    private readonly fileService: FileService,

    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) {}

  async fetchMedia(options: PostOptions): Promise<MediaDto[]> {
    // todo: добавить пагинацию
    const media: Media[] = await this.mediaRepo.find({
      where: { mimetype: 'webp' },
      order: { id: 'DESC' },
    });

    return plainToClassResponse(MediaDto, media);
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

    return deleteMedia;
  }

  async saveImage(file: Express.Multer.File, type: FileType) {
    const image = await this.fileService.createImageWebP(file, type);

    const media = this.mediaRepo.create({
      name: image.name,
      originalName: file.originalname,
      path: JSON.stringify(image.path),
      mimetype: image.format,
      size: file.size,
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