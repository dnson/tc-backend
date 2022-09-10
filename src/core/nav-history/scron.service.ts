import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NavHistoryService } from './nav-history.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

const MAFBAL_url = 'https://www.manulifeam.com.vn/funds/fund-details/_jcr_content/root/responsivegrid_1172645951/responsivegrid/funddetails.details.fid-MAFBAL.html';
const MAFEQI_url = 'https://www.manulifeam.com.vn/funds/fund-details/_jcr_content/root/responsivegrid_1172645951/responsivegrid/funddetails.details.fid-MAFEQI.html';
@Injectable()
export class NavHistoryCronService {

  private readonly logger = new Logger(NavHistoryCronService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly navHistoryService: NavHistoryService
  ) {
  }
  async fetchContent(arCode: string[]) {
    const arP = arCode.map((code) => lastValueFrom(this.httpService.get(code).pipe(
      map(resp => resp.data)
    )));
    return await Promise.all(arP);

  }
  async getAllAndUpdateData() {
    const results = await this.fetchContent([MAFBAL_url, MAFEQI_url]);
    if(results?.length) {
      results.forEach((result) => {
        this.navHistoryService.create(
          {
            nav: result.nav.price,
            navDate: result.nav.asOfDate,
            productId: result.nav.shareClassId,
            navObject: {
              ...result.nav,
              fundName: result.fundName
            }
          }
        )
      })
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  handleCron() {
    this.logger.debug('Called when the current second is 10');
    this.getAllAndUpdateData()
  }
}
