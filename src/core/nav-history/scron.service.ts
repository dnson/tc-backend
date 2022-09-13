import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NavHistoryService } from './nav-history.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import * as moment from 'moment';

const MAFBAL_url = 'https://www.manulifeam.com.vn/funds/fund-details/_jcr_content/root/responsivegrid_1172645951/responsivegrid/funddetails.prices.fid-MAFBAL.html';
const MAFEQI_url = 'https://www.manulifeam.com.vn/funds/fund-details/_jcr_content/root/responsivegrid_1172645951/responsivegrid/funddetails.prices.fid-MAFEQI.html';
@Injectable()
export class NavHistoryCronService {

  private readonly logger = new Logger(NavHistoryCronService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly navHistoryService: NavHistoryService
  ) {
    // this.getAllAndUpdateDataOnce()
  }
  async fetchContent(arCode: string[]) {
    const arP = arCode.map((code) => lastValueFrom(this.httpService.get(code).pipe(
      map(resp => resp.data)
    )));
    return await Promise.all(arP);

  }

  async getAllAndUpdateDataOnce() {
    try {
      const results = await this.fetchContent([MAFBAL_url, MAFEQI_url]);
      const productMap = ['MAFBAL', 'MAFEQI']
      console.log(results[0]?.length)
      if (results?.length) {
        results.map((result, index) => {
          result.forEach((data) => {
            if(!data.price || !data.asOfDate) return;
            try {
              this.navHistoryService.create(
                {
                  nav: data.price,
                  navDateStr: data.asOfDate,
                  navDate: moment(data.asOfDate).valueOf(),
                  productId: productMap[index],
                  navObject: {}
                }
              )
            } catch (e) {
              console.error(JSON.stringify(e))
            }
          })
        })
      }
    } catch (e) {
      console.error(JSON.stringify(e))
    }
  }


  async getAllAndUpdateData() {
    const results = await this.fetchContent([MAFBAL_url, MAFEQI_url]);
    const productMap = ['MAFBAL', 'MAFEQI']
    if(results?.length) {
      results.forEach((result, index) => {
        this.navHistoryService.create(
          {
            nav: result.nav.price,
            navDateStr: result.nav.asOfDate,
            productId: productMap[index],
            navDate: moment(result.nav.asOfDate).valueOf(),
            navObject: {
              ...result.nav,
              fundName: result.fundName
            }
          }
        )
      })
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  handleCron() {
    this.logger.debug('Called when the current second is 10');
    this.getAllAndUpdateData()
  }
}
