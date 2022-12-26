import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostTaxonomyDto } from './request/PostTaxonomyDto';
import { ResTaxonomyDto } from './response/ResTaxonomyDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, Taxonomy } from '../typeorm';
import { Repository } from 'typeorm';
import { Exception500, TaxonomyType } from '../types/enums';
import { PatchTaxonomyDto } from './request/PatchTaxonomyDto';

@Injectable()
export class TaxonomyService {
  constructor(
    @InjectRepository(Taxonomy) private taxonomyRepo: Repository<Taxonomy>,
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
  ) {}

  async getTaxonomy(type: TaxonomyType): Promise<ResTaxonomyDto[]> {
    return (await this.getTaxonomyByType(type)).map(
      (taxonomy) => new ResTaxonomyDto(taxonomy),
    );
  }

  async saveTaxonomy(taxonomy: PostTaxonomyDto): Promise<ResTaxonomyDto[]> {
    await this.taxonomyRepo.save({
      ...taxonomy,
      ...(await this.getMedia({ icon: taxonomy.icon, image: taxonomy.image })),
    });

    return (await this.getTaxonomyByType(taxonomy.type)).map(
      (taxonomy) => new ResTaxonomyDto(taxonomy),
    );
  }

  async deleteTaxonomy(id: number): Promise<Taxonomy> {
    const taxonomy = await this.getTaxonomyById(id);
    return this.taxonomyRepo.remove(taxonomy);
  }

  async updateTaxonomy(taxonomy: PatchTaxonomyDto): Promise<ResTaxonomyDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, icon, image, ...props } = taxonomy;
    const editTaxonomy = await this.taxonomyRepo.findOne({ where: { id } });
    const media = await this.getMedia({ icon, image });

    return new ResTaxonomyDto(
      await this.taxonomyRepo.save({
        ...editTaxonomy,
        ...props,
        ...media,
      }),
    );
  }

  // HELPERS
  async getMediaData(id: number): Promise<Media | undefined> {
    return id ? await this.mediaRepo.findOne({ where: { id } }) : undefined;
  }

  async getMedia(props: { icon: number; image: number }) {
    const mediaIcon = await this.getMediaData(props.icon);
    const mediaImage = await this.getMediaData(props.image);

    return { icon: mediaIcon, image: mediaImage };
  }

  async getTaxonomyById(id: number): Promise<Taxonomy> {
    const taxonomy = await this.taxonomyRepo.findOne({
      where: { id },
    });

    if (!taxonomy) {
      throw new InternalServerErrorException(Exception500.findTaxonomy);
    }

    return taxonomy;
  }

  async getTaxonomyByType(type: TaxonomyType): Promise<Taxonomy[]> {
    return this.taxonomyRepo.find({
      relations: ['icon', 'image'],
      where: { type },
      order: { name: 'ASC' },
    });
  }
}
