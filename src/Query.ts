import { Collection, FilterQuery, FindOneOptions } from "mongodb";
import { DocInfo } from "./interfaces";

export type Operator = '<' | '<=' | '==' | '>' | '>=' | '!=' | 'contains' | 'contains-any' | 'in' | 'not-in';

export type QueryValue = string | number | boolean | QueryValue[];

interface Operation {
    field: string;
    operator: Operator;
    value: QueryValue;
}

const operators = {
    '<': 'lt',
    '<=': 'lte',
    '==': 'eq',
    '>': 'gt',
    '>=': 'gte',
    '!=': 'ne',
    'in': 'in',
    'not-in': 'nin'
}

type ComplexOperator = 'and' | 'or' | 'nor';

interface ComplexOperationBase {
    operator: ComplexOperator;
}

interface ComplexOperationMultiple extends ComplexOperationBase {
    queries: Query[]
}

interface ComplexOperationSingle extends ComplexOperationBase {
    query: Query;
}

type ComplexOperation = ComplexOperationMultiple | ComplexOperationSingle;

const isSingleQuery = (operation: ComplexOperation): operation is ComplexOperationSingle => {
    return (operation as ComplexOperationSingle).query != null;
}

export default class Query {
    operations: Operation[];
    complexOperations: ComplexOperation[];
    _order?: {
        field: string;
        ascending: boolean;
    };
    _limit?: number;
    constructor(public collection?: Collection) {
        this.operations = [];interface DocSetOpts {
    merge?: boolean;
}

interface BaseDocInfo { 
    id: string;
    exists: boolean;
}

interface DocInfo<T> extends BaseDocInfo {
    data(): T;
}

interface ChangedInfo<T> extends BaseDocInfo {
    change: {
        updatedFields: {},
        removedFields: string[]
    }
}
        this.complexOperations = [];
    }
    addComplexQuery(operator: ComplexOperator, queries: Query | Query[]) {
        if (Array.isArray(queries)) {
            this.complexOperations.push({
                operator,
                queries: queries
            });
        } else {
            this.complexOperations.push({
                operator,
                query: queries
            });
        }
        return this;
    }
    and(...queries: Query[]) {
        this.addComplexQuery('and', queries);
        return this;
    }
    or(...queries: Query[]) {
        this.addComplexQuery('or', queries);
        return this;
    }
    neither(...queries: Query[]) {
        this.addComplexQuery('nor', queries);
        return this;
    }
    nor(...queries: Query[]) {
        this.neither(...queries);
        return this;
    }
    merge(query: Query) {
        this.operations.push(...query.operations);
        return this;
    }
    where(field: string, operator: Operator, value: QueryValue) {
        this.operations.push({ 
            field,
            operator,
            value
        });
        return this;
    }
    orderBy(field: string, ascending: string = 'asc') {
        this._order = { 
            field, 
            ascending: ascending.startsWith('asc')
        };
        return this;
    }
    limit(count: number) {
        this._limit = count;
        return this;
    }
    asFilter<T>(): FilterQuery<T> {
        const filter = {};
        for (const { field, operator, value } of this.operations) {
            filter[field] = {
                [`\$${operators[operator]}`]: value
            }
        }
        for (const operation of this.complexOperations) {
            const { operator } = operation;
            if (isSingleQuery(operation)) {
                filter[`\$${operator}`] = operation.query.asFilter();
            } else {
                filter[`\$${operator}`] = operation.queries.map(i => i.asFilter());
            }
        }
        return filter;
    }
    async get<T>(options: FindOneOptions<T extends any ? any : T> = {}): Promise<DocInfo<T>[]> {
        const filter = this.asFilter<T>();
        const cursor = this.collection.find<T>(filter, options);
        if (this._limit) {
            cursor.limit(this._limit);
        }
        if (this._order) {
            cursor.sort(this._order.field, this._order.ascending ? 1 : -1);
        }
        return cursor
            .toArray()
            .then(i => i.map(doc => {
                return {
                    id: (doc as any)._id,
                    exists: true,
                    data() {
                        return doc;
                    }
                }
            }));
    }
    async getData<T>(options: FindOneOptions<T extends any ? any : T> = {}) {
        return this.get<T>(options).then(docs => docs.map(doc => doc.data()));
    }
}