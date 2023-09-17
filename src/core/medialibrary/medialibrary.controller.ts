import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/jwt/access-jwt-auth-guard.service';
import { MediaDto } from './dtos/media.dto';
import { MedialibraryService } from './services/medialibrary.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Routs } from '../../utils/types/enums';
import { ItemsPageProps, PostOptions } from '../../utils/types/types';
import { Media } from '../../database/entity';

@Controller(Routs.media)
export class MedialibraryController {
  constructor(private readonly medialibraryService: MedialibraryService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getMedia(
    @Query('offset') offset?: number,
    @Query('count') count?: number,
  ): Promise<{ items: MediaDto[]; props: ItemsPageProps }> {
    const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };

    return this.medialibraryService.fetchMedia(props);
  }

  @Post('upload')
  @UseGuards(AccessJwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images[]', maxCount: 10 }]))
  insertMedia(@UploadedFiles() files: Express.Multer.File[]): Promise<boolean> {
    return this.medialibraryService.insertMediaData(files['images[]']);
  }

  @Delete(':id')
  @UseGuards(AccessJwtAuthGuard)
  removeMedia(@Param('id') id: number): Promise<Media> {
    return this.medialibraryService.deleteMediaData(id);
  }
}
