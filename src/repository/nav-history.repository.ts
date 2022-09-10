import { Injectable } from '@nestjs/common';
import { Connection, FilterQuery, Model, Types } from 'mongoose';
import * as moment from 'moment';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateNavHistoryDto } from 'src/core/nav-history/dto/create-nav-history.dto';
import {
  NavHistoryDocument,
  NavHistoryEntity,
} from '../model/nav-history.entity';

export interface INavHistoryRepository {
  createNavHistory(
    createNavHistoryDto: CreateNavHistoryDto,
  ): Promise<any>;

  findAll(
    conditions?: FilterQuery<NavHistoryEntity>,
  ): Promise<Array<NavHistoryEntity>>;

  findByConditions(
    conditions: FilterQuery<NavHistoryEntity>,
    sorts: any,
    offset: number,
    limit: number,
  ): Promise<Array<NavHistoryEntity>>;

  countTotalByConditions(
    conditions: FilterQuery<NavHistoryEntity>,
  ): Promise<number>;
}

@Injectable()
export class NavHistoryRepository implements INavHistoryRepository {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(NavHistoryEntity.name)
    private readonly navHistoryModal: Model<NavHistoryDocument>,
  ) {}

  async createNavHistory(
    createNavHistoryDto: CreateNavHistoryDto,
  ): Promise<any> {
    const navHistory = new this.navHistoryModal({
      navDate: createNavHistoryDto.navDate,
      nav: createNavHistoryDto.nav,
      productId: createNavHistoryDto.productId,
      navObject: createNavHistoryDto.navObject,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
    });
    return navHistory.save();
  }

  async findAll(
    conditions?: FilterQuery<NavHistoryEntity>,
  ): Promise<Array<NavHistoryEntity>> {
    return await this.navHistoryModal
      .find(conditions)
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async findByConditions(
    conditions: FilterQuery<NavHistoryEntity>,
    sorts: any,
    offset: number,
    limit: number,
  ): Promise<Array<NavHistoryEntity>> {
    const result = await this.navHistoryModal
      .find(conditions)
      .sort(sorts)
      .skip(offset)
      .limit(limit)
      .exec();
    return result;
  }

  async countTotalByConditions(
    conditions: FilterQuery<NavHistoryEntity>,
  ): Promise<number> {
    return this.navHistoryModal.countDocuments(conditions);
  }
}
