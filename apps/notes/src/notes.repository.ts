import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Note } from './schemas/note.schema';

@Injectable()
export class NotesRepository extends AbstractRepository<Note> {

  protected readonly logger = new Logger(NotesRepository.name);

  constructor(
    @InjectModel(Note.name) noteModel: Model<Note>,
    @InjectConnection() connection: Connection,
  ) {
    super(noteModel, connection);
  }
}
