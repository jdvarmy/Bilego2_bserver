import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from '../typeorm';
import { Repository } from 'typeorm';
import { MediaDto } from '../dtos/MediaDto';
import { FileService } from '../file/file.service';
import { Exception500, FileType } from '../types/enums';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class MedialibraryService {
  constructor(
    private readonly fileService: FileService,
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
  ) {}

  async getMedia(): Promise<MediaDto[]> {
    const media: Media[] = await this.mediaRepo.find({ order: { id: 'DESC' } });

    return media.map((image) => new MediaDto(image));
  }

  async insertMediaData(files: Express.Multer.File[]): Promise<boolean> {
    for (const file of files) {
      // todo: переделать, убрать await
      await this.saveMediaToDB(file);
    }

    return true;
  }

  async deleteMediaData(id: number): Promise<boolean> {
    const media = await this.mediaRepo.findOne({ where: { id } });
    await this.mediaRepo.remove(media);

    this.fileService.removeFile(media.path);

    return true;
  }

  async saveMediaToDB(file: Express.Multer.File): Promise<Media> {
    const imagePath = this.fileService.createFile(FileType.image, file);

    const media = this.mediaRepo.create({
      originalName: file.originalname,
      path: imagePath,
      mimetype: file.mimetype,
      encoding: file.encoding,
      size: file.size,
    });

    return this.mediaRepo.save(media);
  }

  async getMediaById(
    id?: number,
    relations?: FindOptionsRelations<Media>,
  ): Promise<Media> {
    if (!id) return;

    const media = await this.mediaRepo.findOne({
      where: { id },
      relations,
    });

    if (!media) {
      throw new InternalServerErrorException(Exception500.findMedia);
    }

    return media;
  }
}
