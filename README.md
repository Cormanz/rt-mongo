# mongo-fire

`mongo-fire`, a wrapper for the [`node-mongo-driver`](https://www.npmjs.com/package/mongodb), allows you to easily and simply manage your MongoDB databases in real time, with an API similar to the [firestore web api](https://firebase.google.com/docs/firestore).

You can do the following with `mongo-fire`:

- Add new documents to collections
- Grab documents (and their data) from their IDs
- Delete documents directly or from queries
- Listen to document changes in real time
- Set or update documents and their values
- Query documents (with **compound queries** too, not in firestore)

`mongo-fire` is written in TypeScript, so you can get intellisense and type-checking easily.

## Why use mongo-fire?

The `mongo-fire` API is very simple and easy to use, but it's not perfect in all scenarios.

For making web apps, you should use firestore since it has database rules to prevent your users from accessing specific data

However, `mongo-fire` is great for projects like bots for services like discord and guilded and other instances.

## Quickstart

```ts
import { createClient } from 'mongo-fire';

const main = async () => {
    const client = await createClient('mongodb://localhost:27017');
    const db = client.database('mongofiretest');
    const employees = db.collection('employees');

    const employees = [
        {
            name: 'Bob',
            job: 'Programmer',
        },
        {
            name: 'Tom',
            job: 'Programmer'
        },
        {
            name: 'Addison',
            job: 'CEO'
        }
    ];

    const promises = employees.map(employee => db.add(employee));

    await Promise.all(promises);

    const query = await employees
        .where('job', '==', 'Programmer')
        .getData();

    console.log(query);
};

main();
```

## Examples

**Getting documents from their ID and getting data, then deleting it.**

```ts
import { createClient } from 'mongo-fire-test';

const main = async () => {
    const client = await createClient('mongodb://localhost:27017');
    const db = client.database('mongofiretest');
    const col = db.collection('mycol');
    const doc = col.doc(id);
    const data = await doc.getData();
    await doc.delete();
};

main();
```

**Compound queries**

```ts
import { createClient, where } from 'mongo-fire-test';

const main = async () => {
    const client = await createClient('mongodb://localhost:27017');
    const db = client.database('mongofiretest');
    const collection = db.collection('mycol');
    const docs = await collection
        .where('job', 'in', [ 'X', 'Y' ])
        .neither(
            where('name', '==', 'Bob'),
            where('yearsAtJob', '==', '1')
        )
        .getData();
};

main();
```