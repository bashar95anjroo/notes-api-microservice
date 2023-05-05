import { Logger, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
  QueryOptions,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: QueryOptions,
  ) {
    const updatedDocument = await this.model.findOneAndUpdate(
      filterQuery,
      update,
      {
        lean: true,
        new: true, // return the modified document rather than the original
        runValidators: true, // apply validators on update
        useFindAndModify: false, // use findOneAndUpdate() instead of findAndModify()
        ...options,
      },
    );

    if (!updatedDocument) {
      throw new NotFoundException(
        `Document with filter query ${JSON.stringify(filterQuery)} not found.`,
      );
    }

    return updatedDocument;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }
  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
    options?: QueryOptions,
  ) {
    const deletedDocument = await this.model.findOneAndDelete(filterQuery, {
      lean: true,
      ...options,
    });

    if (!deletedDocument) {
      throw new NotFoundException(
        `Document with filter query ${JSON.stringify(filterQuery)} not found.`,
      );
    }

    return deletedDocument;
  }
  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
