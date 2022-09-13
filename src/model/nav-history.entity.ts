import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type NavHistoryDocument = NavHistoryEntity & Document;

@Schema({ collection: 'nav-history' })
export class NavHistoryEntity {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  @Prop()
  nav: number;

  @ApiProperty()
  @Prop({ type: Object })
  navObject: any;


  @ApiProperty()
  @Prop()
  navDate: number;

  @ApiProperty()
  @Prop()
  navDateStr: string;

  @ApiProperty()
  @Prop()
  productId: string;

  @ApiProperty()
  @Prop()
  createdAt: number;

  @ApiProperty()
  @Prop()
  updatedAt: number;
}

export const NavHistorySchema = SchemaFactory.createForClass(
  NavHistoryEntity,
);
NavHistorySchema.index({productId:1, navDateStr: 1}, { unique: true });
