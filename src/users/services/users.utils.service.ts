import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { Media, Users } from '../../typeorm';
import { Exception500 } from '../../utils/types/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveUserDto } from '../dtos/SaveUser.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uidv4 } from 'uuid';

@Injectable()
export class UsersUtilsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,

    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) {}

  async getUserByUid(
    uid: string,
    relations?: FindOptionsRelations<Users>,
  ): Promise<Users> {
    const user = await this.usersRepo.findOne({
      where: { uid },
      relations,
    });

    if (!user) {
      throw new InternalServerErrorException(Exception500.findUser);
    }

    return user;
  }

  async prepareUserDataToSave(data: SaveUserDto, uid?: string): Promise<Users> {
    const { email, password, avatar, ...userMeta } = data;
    if (!email || (!uid && !password)) {
      throw new InternalServerErrorException(Exception500.saveUser);
    }

    const user = this.usersRepo.create({
      uid: uidv4(),
      email,
      login: email,
      pass: await bcrypt.hash(password, 13),
      ...userMeta,
    });

    const userAvatar = await this.mediaRepo.findOne({ where: { id: avatar } });
    if (userAvatar) {
      user.avatar = userAvatar;
    }

    return user;
  }
}
