import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNavHistoryDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  nav: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  navDateStr: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  navDate: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  productId: string;

  @IsOptional()
  navObject?: any;
}
