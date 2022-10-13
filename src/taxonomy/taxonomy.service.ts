import { Injectable } from '@nestjs/common';
import { ReqTaxonomyDto } from '../dtos/request/ReqTaxonomyDto';
import { TaxonomyDto } from '../dtos/TaxonomyDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, Taxonomy } from '../typeorm';
import { Repository } from 'typeorm';
import { TaxonomyType } from '../types/enums';

@Injectable()
export class TaxonomyService {
  constructor(
    @InjectRepository(Taxonomy) private taxonomyRepo: Repository<Taxonomy>,
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
  ) {}

  async getTaxonomy(type: TaxonomyType): Promise<TaxonomyDto[]> {
    return (await this.getTaxonomyByType(type)).map(
      (taxonomy) => new TaxonomyDto(taxonomy),
    );
  }

  async saveTaxonomy(taxonomy: ReqTaxonomyDto): Promise<TaxonomyDto[]> {
    const mediaIcon = await this.getMedia(taxonomy.icon);
    const mediaImage = await this.getMedia(taxonomy.image);

    await this.taxonomyRepo.save({
      ...taxonomy,
      icon: mediaIcon,
      image: mediaImage,
    });

    return (await this.getTaxonomyByType(taxonomy.type)).map(
      (taxonomy) => new TaxonomyDto(taxonomy),
    );
  }

  async getTaxonomyByType(type: TaxonomyType): Promise<Taxonomy[]> {
    return this.taxonomyRepo.find({
      relations: ['icon', 'image'],
      where: { type },
      order: { name: 'ASC' },
    });
  }

  async getMedia(id: number): Promise<Media | undefined> {
    return id ? await this.mediaRepo.findOne({ where: { id } }) : undefined;
  }
}
