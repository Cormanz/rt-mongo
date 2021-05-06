const { createClient, where } = require('.');

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const choice = items => items[Math.floor(Math.random() * items.length)];

const names = [
    'Bob',
    'Addison',
    'Jack',
    'Jacob',
    'Matt',
    'Patrick',
    'Tom'
];
const jobs = [
    'Programmer',
    'Salesman',
    'Marketing',
    'Graphic Designer',
    'Ethicist'
];

const makeEmployee = () => ({
    name: choice(names),
    job: choice(jobs)
});

beforeEach(async done => {
    const client = await createClient('mongodb://localhost:27017');
    const db = client.db('jsmongo');
    const col = db.collection('col');
    await col.clear();
    done();
});

describe('Add Items to Database', () => {
    test('Simple Add', async done => {
        const client = await createClient('mongodb://localhost:27017');
        const db = client.db('jsmongo');
        const food = db.collection('col');
        await food.add({ name: 'Burger' });
        await food.add({ name: 'Fries' });
        expect(await food.getData().then(i => i.length)).toBe(2);
        done();
    });
});

describe('Query Database', () => {
    test('Simple Query', () => {
        const callback = async () => {
            const client = await createClient('mongodb://localhost:27017');
            const db = client.db('jsmongo');
            const employees = db.collection('col');    

            for (let i = 0; i < 30; i++) {
                await employees.add(makeEmployee());
            }

            const data =  await employees
                .where('job', '==', 'Marketing')
                .getData();

            return data.length > 0 && data.every(i => i.job === 'Marketing');
        }
        return expect(callback()).resolves.toBe(true);
    });
    test('Complex Query', () => {
        const callback = async () => {
            const client = await createClient('mongodb://localhost:27017');
            const db = client.db('jsmongo');
            const employees = db.collection('col');    

            for (let i = 0; i < 50; i++) {
                await employees.add(makeEmployee());
            }

            const data =  await employees
                .neither(
                    where('job', '!=', 'Marketing'),
                    where('name', 'in', [ 'Bob', 'Tom' ])
                )
                .getData();

            const hasBobOrTom = data
                .some(i => [ 'Bob', 'Tom' ].includes(i.name));

            const isNotMarketing = data
                .some(i => i.job !== 'Marketing')

            return data.length > 0 && !hasBobOrTom && !isNotMarketing;
        }
        return expect(callback()).resolves.toBe(true);
    });
    test('Ordered Query', () => {
        const callback = async () => {
            const client = await createClient('mongodb://localhost:27017');
            const db = client.db('jsmongo');
            const nums = db.collection('col');    

            for (let i = 0; i < 1000; i++) {
                await nums.add({
                    value: i
                });
            };

            const numbers = await nums.orderBy('value').getData();
            return numbers[numbers.length - 1].value === 999;
        }
        return expect(callback()).resolves.toBe(true);        
    });
});