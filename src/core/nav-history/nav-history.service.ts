import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { CreateNavHistoryDto } from './dto/create-nav-history.dto';
import { INavHistoryRepository } from '../../repository/nav-history.repository';
import { NavHistoryEntity } from '../../model/nav-history.entity';
import * as moment from 'moment';

export interface INavHistoryService {
  create(createNavHistoryDto: CreateNavHistoryDto): Promise<any>;

  findAll(offset: number, limit: number): Promise<any>;

  findByProductId(productId: string, {
    offset,
    limit,
    fromDate,
    toDate
  }:any): Promise<any>
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

  async findByProductId(productId: string, {
    offset,
    limit,
    fromDate,
    toDate
  }:any): Promise<any> {
    const conditions: FilterQuery<NavHistoryEntity> = {
      productId: productId,
      navDate: {}
    };
    if(fromDate) {
      conditions.navDate['$gte'] =  moment(fromDate, 'YYYYMMDD').valueOf();
    }
    if(toDate) {
      conditions.navDate['$lte'] =  moment(toDate, 'YYYYMMDD').valueOf();
    }
    return await this.NavHistoryRepository.findByConditions(
      conditions,
      {
        navDate: 1,
      },
      offset,
      limit
    );
  }
}
