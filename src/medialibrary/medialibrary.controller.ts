import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { MediaDto } from './dtos/Media.dto';
import { MedialibraryService } from './services/medialibrary.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Routs } from '../utils/types/enums';
import { DataLoggerService } from '../logger/data.logger.service';
import { AuthUser } from '../utils/decorators/AuthUser';
import { UserDto } from '../users/dtos/User.dto';
import { PostOptions } from '../utils/types/types';
import { Media } from '../typeorm';

@Controller(Routs.media)
export class MedialibraryController {
  constructor(
    private readonly medialibraryService: MedialibraryService,
    private readonly dataLoggerService: DataLoggerService,
  ) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getMedia(
    @AuthUser() user: UserDto,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
  ): Promise<MediaDto[]> {
    try {
      const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };

      this.dataLoggerService.dbLog(`User ${user.uid} запросил список media`);

      return this.medialibraryService.fetchMedia(props);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('upload')
  @UseGuards(AccessJwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images[]', maxCount: 10 }]))
  async insertMedia(
    @AuthUser() user: UserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<boolean> {
    try {
      this.dataLoggerService.dbLog(`User ${user.uid} добавил новые media`, [
        HttpStatus.CREATED,
        'Created',
      ]);

      return this.medialibraryService.insertMediaData(files['images[]']);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':id')
  @UseGuards(AccessJwtAuthGuard)
  async removeMedia(
    @AuthUser() user: UserDto,
    @Param('id') id: number,
  ): Promise<Media> {
    try {
      const media = await this.medialibraryService.deleteMediaData(id);

      this.dataLoggerService.dbLog(
        `User ${user.uid} удалил media ${
          media.originalName ?? media.name ?? media.id
        }`,
      );

      return media;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
