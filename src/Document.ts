import { Collection, ObjectId } from "mongodb";
import { ChangedInfo, DocInfo } from './interfaces';

interface DocSetOpts {
    merge?: boolean;
}

export default class Document<T> {
    constructor(public collection: Collection, public id: string) {}
    async set(content: any, opts: DocSetOpts = {}) {
        if (opts.merge) {
            await this.collection.findOneAndUpdate({ 
                _id: new ObjectId(this.id),
            }, { $set: content }, { upsert: true });
        } else {
            await this.collection.findOneAndReplace({ 
                _id: new ObjectId(this.id) 
            }, content);
        }
    }
    async delete() {
        return this.collection.deleteMany({ _id: this.id });
    }
    async get(): Promise<DocInfo<T>> {
        const { collection } = this;
        const findResult = await collection.findOne({ _id: this.id });
        return {
            id: this.id,
            exists: findResult !== undefined,
            data() {
                return findResult;
            }
        }
    }
    async getData() {
        return this.get().then(i => i.data());
    }
    update(content: any) {
        return this.set(content, { merge: true });
    }
    onSnapshot(callback: (change: ChangedInfo<T>) => any) {
        const document = this;
        const stream = this.collection.watch();
        stream.on('change', doc => {
            let anyDoc = doc as any;
            const id = anyDoc.documentKey._id.toString();
            //Note: Using != because JS throws a fit otherwise.
            if (id != document.id) {
                return;
            }
            const { operationType } = doc;
            switch (operationType) {
                case 'update':
                    // @ts-ignore
                    callback({
                        id,
                        exists: true,
                        change: anyDoc.updateDescription
                    });
            }
        });
    }
}