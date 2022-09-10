import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNavHistoryDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  nav: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  navDate: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  productId: string;

  @IsOptional()
  navObject?: any;
}
