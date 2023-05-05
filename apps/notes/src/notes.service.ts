import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { v4 as uuid } from 'uuid';
import { NotesRepository } from './notes.repository';
import { CreateNoteDto } from './dto/create-note.request';
import { lastValueFrom } from 'rxjs';
import { UpdateNoteDto } from './dto/update-note.request';

@Injectable()
export class NotesService {
  private client: ClientProxy;

  constructor(private readonly notesRepository: NotesRepository) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'notes_queue',
      },
    });
  }
  // This method retrieves all the notes available in the database by calling
  async findAll(authentication: string): Promise<Note[]> {
    const notes = await this.notesRepository.find({});
    await lastValueFrom(
      this.client.emit('notes_found', {
        notes,
        Authentication: authentication,
      }),
    );
    return notes;
  }
  //This method retrieves a single note from the database by calling this.notesRepository.findOne({ id }).
  async findOne(id: string, authentication: string) {
    const note = await this.notesRepository.findOne({ _id: id });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    await lastValueFrom(
      this.client.emit('note_found', {
        note,
        Authentication: authentication,
      }),
    );
    return note;
  }
  //This method creates a new note by calling this.notesRepository.create(request, { session }).
  async create(request: CreateNoteDto, authentication: string): Promise<Note> {
    // const session = await this.notesRepository.startTransaction();
    try {
      // const note = await this.notesRepository.create(request, { session });
      const note = await this.notesRepository.create(request);
      await lastValueFrom(
        this.client.emit('order_created', {
          request,
          Authentication: authentication,
        }),
      );
      // await session.commitTransaction();
      return note;
    } catch (err) {
      // await session.abortTransaction();
      throw err;
    }
  }

  async update(
    id: string,
    request: UpdateNoteDto,
    authentication: string,
  ): Promise<Note> {
    // const session = await this.notesRepository.startTransaction();
    try {
      const noteData = { ...request }; // convert UpdateNoteDto to Note
      const filterQuery = { _id: id }; // create a filter query
      // const note = await this.notesRepository.findOneAndUpdate(
      //   filterQuery, // use the filter query
      //   noteData,
      //   { session },
      // );
      const note = await this.notesRepository.findOneAndUpdate(
        filterQuery, // use the filter query
        noteData,
      );
      await lastValueFrom(
        this.client.emit('note_updated', {
          request,
          Authentication: authentication,
        }),
      );
      // await session.commitTransaction();
      return note;
    } catch (err) {
      // await session.abortTransaction();
      throw err;
    }
  }

  async remove(id: string, authentication: string): Promise<Note> {
    // const session = await this.notesRepository.startTransaction();
    try {
      const filterQuery = { _id: id }; // create a filter query
      // const deletedNote = await this.notesRepository.findOneAndDelete(
      //   filterQuery,
      //   {
      //     session,
      //   },
      // );
      const deletedNote = await this.notesRepository.findOneAndDelete(
        filterQuery,
      );
      await this.client
        .emit('note_deleted', {
          deletedNote,
          Authentication: authentication,
        })
        .toPromise();
      // await session.commitTransaction();
      return deletedNote;
    } catch (err) {
      // await session.abortTransaction();
      throw err;
    }
  }
}
