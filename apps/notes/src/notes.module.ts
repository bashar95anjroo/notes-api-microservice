import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { NotesRepository } from './notes.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';
import { NOTES_SERVICE } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/notes/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    RmqModule.register({
      name: NOTES_SERVICE,
    }),
    AuthModule,
  ],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
})
export class NotesModule {}
