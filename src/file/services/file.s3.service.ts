import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { CLOUD_S3_BUCKET } from '../../utils/types/constants/env';
import { ManagedUpload } from 'aws-sdk/clients/s3';

@Injectable()
export class FileS3Service {
  constructor(@InjectS3() private readonly s3: S3) {}

  saveToS3(buffer: Buffer, key: string, patch: string): ManagedUpload {
    try {
      return this.s3.upload(
        { Bucket: `${CLOUD_S3_BUCKET}/${patch}`, Key: key, Body: buffer },
        function (e, data) {
          if (e) {
            throw new InternalServerErrorException(e);
          }
        },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  removeFromS3(key: string[]) {
    this.s3.deleteObjects(
      {
        Bucket: CLOUD_S3_BUCKET,
        Delete: { Objects: key.map((k) => ({ Key: k })) },
      },
      function (e, data) {
        if (e) {
          throw new InternalServerErrorException(e);
        }
      },
    );
  }
}
