import { MongoClient, MongoClientCommonOption } from "mongodb";
import Database from "./Database";

export default class Client {
    constructor(public client: MongoClient) {}
    db(name: string, options?: MongoClientCommonOption) {
        return new Database(this.client.db(name, options));
    }
}
