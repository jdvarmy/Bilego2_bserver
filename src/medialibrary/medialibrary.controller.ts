import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { MediaDto } from './dtos/Media.dto';
import { MedialibraryService } from './services/medialibrary.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Routs } from '../utils/types/enums';

@Controller(Routs.media)
export class MedialibraryController {
  constructor(private readonly medialibraryService: MedialibraryService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getMedia(@Req() req): Promise<MediaDto[]> {
    try {
      return this.medialibraryService.fetchMedia();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('upload')
  @UseGuards(AccessJwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images[]', maxCount: 10 }]))
  insertMedia(@UploadedFiles() files: Express.Multer.File[]): Promise<boolean> {
    try {
      return this.medialibraryService.insertMediaData(files['images[]']);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':id')
  @UseGuards(AccessJwtAuthGuard)
  removeMedia(@Param('id') id: number): Promise<boolean> {
    try {
      return this.medialibraryService.deleteMediaData(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
