import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostTaxonomyDto } from './request/PostTaxonomyDto';
import { ResTaxonomyDto } from './response/ResTaxonomyDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, Taxonomy } from '../typeorm';
import { Repository } from 'typeorm';
import { Exception500, TaxonomyType, TaxonomyTypeLink } from '../types/enums';
import { PatchTaxonomyDto } from './request/PatchTaxonomyDto';
import cloneDeep from '../utils';
import { MedialibraryService } from '../medialibrary/medialibrary.service';

@Injectable()
export class TaxonomyService {
  constructor(
    private readonly medialibraryService: MedialibraryService,
    @InjectRepository(Taxonomy) private taxonomyRepo: Repository<Taxonomy>,
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
  ) {}

  async getTaxonomy(
    link: TaxonomyTypeLink,
    type?: TaxonomyType,
  ): Promise<ResTaxonomyDto[]> {
    if (type) {
      return (await this.getTaxonomyByType(type)).map(
        (taxonomy) => new ResTaxonomyDto(taxonomy),
      );
    }

    return (await this.getTaxonomyByLink(link)).map(
      (taxonomy) => new ResTaxonomyDto(taxonomy),
    );
  }

  async saveTaxonomy(taxonomy: PostTaxonomyDto): Promise<ResTaxonomyDto[]> {
    const overIndex = await this.taxonomyRepo.findOne({
      where: { type: taxonomy.type },
      order: { overIndex: 'desc', id: 'desc' },
    });

    await this.taxonomyRepo.save({
      ...taxonomy,
      overIndex: overIndex?.overIndex ? overIndex.overIndex + 1 : 0,
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
    const { id, icon, image, overIndex, ...props } = taxonomy;

    if (typeof overIndex === 'number' && overIndex + 1 && props.type) {
      // ???????????? ?????????????? ??????????????????????
      return this.updateIndex({ id, overIndex, ...props });
    } else {
      // ???????????? ?????????????????? ????????????????????
      const taxonomyFromDb = await this.getTaxonomyById(id);
      const updateTaxonomyData = this.taxonomyRepo.create(props);
      const media = await this.getMedia({ icon, image });
      return this.update({
        ...taxonomyFromDb,
        ...updateTaxonomyData,
        ...media,
      });
    }
  }

  // HELPERS
  async update(taxonomy): Promise<ResTaxonomyDto> {
    return new ResTaxonomyDto(await this.taxonomyRepo.save(taxonomy));
  }

  async updateIndex(taxonomy): Promise<ResTaxonomyDto> {
    const oldItems = (await this.getTaxonomyByType(taxonomy.type)).map(
      (tax) => ({ id: tax.id, overIndex: tax.overIndex }),
    );
    const currentItem = { id: taxonomy.id, overIndex: taxonomy.overIndex };
    const index = oldItems.findIndex((item) => item.id === currentItem.id);
    const newItems = cloneDeep<typeof oldItems>(oldItems) as Array<{
      id: string;
      overIndex: number;
    }>;

    if (index !== -1 && newItems) {
      newItems.splice(index, 1);
      newItems.splice(currentItem.overIndex, 0, currentItem);
      // ?????????????????????????? ??????????????
      newItems.forEach((item, index) => (item.overIndex = index));

      const updateItems: Array<{ id: string; overIndex: number }> = [];
      newItems.forEach((newItem, index) => {
        if (+newItem.id !== +oldItems[index].id) {
          updateItems.push(newItem);
        }
      });

      updateItems.forEach((item) => {
        this.taxonomyRepo
          .createQueryBuilder()
          .update(Taxonomy)
          .set({ overIndex: item.overIndex })
          .where('id = :id', { id: item.id })
          .execute();
      });
    }

    return new ResTaxonomyDto(
      await this.taxonomyRepo.findOne({ where: { id: taxonomy.id } }),
    );
  }

  async getMedia(props: { icon: number; image: number }) {
    const mediaIcon = await this.medialibraryService.getMediaById(props.icon);
    const mediaImage = await this.medialibraryService.getMediaById(props.image);

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

  async getTaxonomyByLink(link: TaxonomyTypeLink): Promise<Taxonomy[]> {
    return this.taxonomyRepo.find({
      relations: ['icon', 'image'],
      where: { link },
      order: { overIndex: 'asc', id: 'asc' },
    });
  }

  async getTaxonomyByType(type: TaxonomyType): Promise<Taxonomy[]> {
    return this.taxonomyRepo.find({
      relations: ['icon', 'image'],
      where: { type },
      order: { overIndex: 'asc', id: 'asc' },
    });
  }
}
