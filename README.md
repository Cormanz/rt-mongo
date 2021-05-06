# rt-mongo

`rt-mongo`, a wrapper for the [`node-mongo-driver`](https://www.npmjs.com/package/mongodb), allows you to easily and simply manage your MongoDB databases in real time, with an API similar to the [firestore web api](https://firebase.google.com/docs/firestore).

You can do the following with `rt-mongo`:

- Add new documents to collections
- Grab documents (and their data) from their IDs
- Delete documents directly or from queries
- Listen to document changes in real time
- Set or update documents and their values
- Query documents (with **compound queries** too, not in firestore)

`rt-mongo` is written in TypeScript, so you can get intellisense and type-checking easily.

## Why use rt-mongo?

The `rt-mongo` API is very simple, fast, and easy to use, a plus some alternatives lack.

Personally, I think `rt-mongo` is great for projects like bots for services like discord and guilded and other instances.

## Alternatives

Although `rt-mongo` is a great tool, it's not the perfect one. Here are some alternatives:

- `quick-mongo` - Quick-mongo also uses MongoDB, but it's a lot more limited. However, it's also very beginner friendly so if you're new to databases and think `rt-mongo` is a little too hard for you, check it out [here](https://quickmongo.js.org/)
- **Firestore** (Firebase) - For web apps, Firestore, and with it, Firebase, is as good as it gets. It's simple, easy to use, and great for your next web project, even with builtin security rules so no one on your frontend can abuse your database. If you like it, try it out [here](https://firebase.google.com)

## Quickstart

```ts
import { createClient } from 'rt-mongo';

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
import { createClient } from 'rt-mongo';

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
import { createClient, where } from 'rt-mongo';

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