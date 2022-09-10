import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIG_DATABASE } from './config/database';
import configs from './config';
import { NavHistoryModule } from './core/nav-history/nav-history.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get(CONFIG_DATABASE),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true, load: configs }),
    NavHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
