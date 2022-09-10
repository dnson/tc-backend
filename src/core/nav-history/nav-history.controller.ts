import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NavHistoryService } from './nav-history.service';
import { CreateNavHistoryDto } from './dto/create-nav-history.dto';
import { NavHistoryEntity } from '../../model/nav-history.entity';

@Controller('/v1/nav-history')
@ApiTags('nav-history')
export class NavHistoryController {
  private readonly logger = new Logger(NavHistoryController.name);

  constructor(
    private readonly navHistoryService: NavHistoryService,
  ) {}

  @Post()
  @ApiOkResponse({ type: NavHistoryEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async createNewPage(
    @Body() createNavHistoryDto: CreateNavHistoryDto,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(
        `create new nav history with information: ${JSON.stringify(
          createNavHistoryDto,
        )}`,
      );
      const navHistory = await this.navHistoryService.create(
        createNavHistoryDto,
      );

      res.status(HttpStatus.OK).send({
        status: 200,
        message: 'success',
        data: { navHistory },
      });
    } catch (err) {
      this.logger.error(
        `create new nav history failed with error ${err}`,
      );
      res.status(HttpStatus.FORBIDDEN).send({
        status: 403,
        message: 'Exception error!',
      });
    }
  }

  @Get('/all/by-product')
  @ApiOkResponse({ type: NavHistoryEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async findAllByCondition(
    @Query('product-id')
      productId: string,
    @Query('offset', ParseIntPipe)
      offset: number,
    @Query('limit', ParseIntPipe)
      limit: number,
    @Res() res: Response,
  ) {
    try {
      const navHistory = await this.navHistoryService.findByProductId(
        productId,
      );
      res.status(HttpStatus.OK).send({
        status: 200,
        message: 'success',
        data: navHistory,
      });
    } catch (err) {
      this.logger.log(`find all nav history failed with error ${err}`);
      res.status(HttpStatus.FORBIDDEN).send({
        status: 403,
        message: 'Exception error!',
      });
    }
  }

  @Get('/all')
  @ApiOkResponse({ type: [NavHistoryEntity] })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async findAll(
    @Query('offset', ParseIntPipe)
    offset: number,
    @Query('limit', ParseIntPipe)
    limit: number,
    @Res()
    res: Response,
  ) {
    try {
      const navHistory = await this.navHistoryService.findAll(offset, limit);
      res.status(HttpStatus.OK).send(navHistory);
    } catch (err) {
      this.logger.log(`find all  nav history failed with error ${err}`);
      res.status(HttpStatus.FORBIDDEN).send({
        status: 403,
        message: 'Exception error!',
      });
    }
  }
}
