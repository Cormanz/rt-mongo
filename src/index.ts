import * as mongodb from 'mongodb';
import Client from './Client';
import Query, { Operator, QueryValue } from './Query';

export const where = (field: string, operator: Operator, value: QueryValue) => new Query().where(field, operator, value);

export const createClient = async (uri: string, options?: mongodb.MongoClientOptions) => {
    return new Client(await mongodb.connect(uri, options))
}