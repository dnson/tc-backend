import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NavHistoryRepository } from '../../repository/nav-history.repository';
import { NavHistoryService } from './nav-history.service';
import { NavHistoryController } from './nav-history.controller';
import {
  NavHistoryEntity,
  NavHistorySchema,
} from '../../model/nav-history.entity';
import { NavHistoryCronService } from './scron.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NavHistoryEntity.name, schema: NavHistorySchema },
    ]),
    HttpModule
  ],
  controllers: [NavHistoryController],
  providers: [
    NavHistoryService,
    NavHistoryCronService,
    {
      provide: 'INavHistoryRepository',
      useClass: NavHistoryRepository,
    },
  ],
})
export class NavHistoryModule {}
