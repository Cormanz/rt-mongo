import { Collection as MongoCollection, CollectionInsertOneOptions } from 'mongodb';
import Document from './Document';
import Query, { Operator, QueryValue } from './Query';

export default class Collection {
    constructor(public collection: MongoCollection) {}
    doc(id: string) {
        return new Document(this.collection, id);
    }
    async add(data: any, opts?: CollectionInsertOneOptions) {
        const res = await this.collection.insertOne(data, opts);
        return {
            id: res.insertedId,
            data
        }
    }
    and(...queries: Query[]) {
        return this.createQuery().and(...queries);
    }
    or(...queries: Query[]) {
        return this.createQuery().or(...queries);
    }
    neither(...queries: Query[]) {
        return this.createQuery().neither(...queries);
    }
    nor(...queries: Query[]) {
        return this.createQuery().neither(...queries);
    }
    createQuery() {
        return new Query(this.collection);
    }
    where(field: string, operator: Operator, value: QueryValue) {
        return this.createQuery().where(field, operator, value);
    }
    orderBy(field: string, ascending: string = 'asc') {
        return this.createQuery().orderBy(field, ascending);
    }
    limit(count: number) {
        return this.createQuery().limit(count);
    }
    get() {
        return this.createQuery().get();
    }
    getData() {
        return this.createQuery().getData();
    }
    async clear(delay = 150) {
        //When not delayed, there may be some unexpected use cases

        return new Promise(res => setTimeout(res, delay))
            .then(() => this.collection.deleteMany({}));
    }
}