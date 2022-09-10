import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetNavHistoryDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  productId: string;
}
