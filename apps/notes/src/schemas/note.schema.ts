import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false, timestamps: true })
export class Note extends AbstractDocument {
  @Prop()
  content: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
