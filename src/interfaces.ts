export interface BaseDocInfo { 
    id: string;
    exists: boolean;
}

export interface DocInfo<T> extends BaseDocInfo {
    data(): T;
}

export interface ChangedInfo<T> extends BaseDocInfo {
    change: {
        updatedFields: {},
        removedFields: string[]
    }
}