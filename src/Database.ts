import { Db } from "mongodb";
import Collection from "./Collection";

export default class Database { 
    constructor(public db: Db) {}
    collection(name: string) {
        return new Collection(this.db.collection(name));
    }
}