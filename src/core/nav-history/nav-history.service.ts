import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { CreateNavHistoryDto } from './dto/create-nav-history.dto';
import { INavHistoryRepository } from '../../repository/nav-history.repository';
import { NavHistoryEntity } from '../../model/nav-history.entity';

export interface INavHistoryService {
  create(createNavHistoryDto: CreateNavHistoryDto): Promise<any>;

  findAll(offset: number, limit: number): Promise<any>;

  findByProductId(productId: string): Promise<any>
}

@Injectable()
export class NavHistoryService implements INavHistoryService {
  constructor(
    @Inject('INavHistoryRepository')
    private readonly NavHistoryRepository: INavHistoryRepository,
  ) {}

  async create(
    createNavHistoryDto: CreateNavHistoryDto,
  ): Promise<any> {
    return await this.NavHistoryRepository.createNavHistory(
      createNavHistoryDto,
    );
  }

  async findAll(offset: number, limit: number): Promise<any> {
    const conditions: FilterQuery<NavHistoryEntity> = {};
    const sorts = {
      createdAt: -1,
    };
    const interactions = await this.NavHistoryRepository.findByConditions(
      conditions,
      sorts,
      offset,
      limit,
    );
    const totalRecord =
      await this.NavHistoryRepository.countTotalByConditions(conditions);
    return { interactions, totalRecord };
  }

  async findByProductId(productId: string): Promise<any> {
    const conditions: FilterQuery<NavHistoryEntity> = {
      productId: productId,
    };
    return await this.NavHistoryRepository.findAll(conditions);
  }398879
}
