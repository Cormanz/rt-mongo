"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var operators = {
    '<': 'lt',
    '<=': 'lte',
    '==': 'eq',
    '>': 'gt',
    '>=': 'gte',
    '!=': 'ne',
    'in': 'in',
    'not-in': 'nin'
};
var isSingleQuery = function (operation) {
    return operation.query != null;
};
var Query = /** @class */ (function () {
    function Query(collection) {
        this.collection = collection;
        this.operations = [];
        this.complexOperations = [];
    }
    Query.prototype.addComplexQuery = function (operator, queries) {
        if (Array.isArray(queries)) {
            this.complexOperations.push({
                operator: operator,
                queries: queries
            });
        }
        else {
            this.complexOperations.push({
                operator: operator,
                query: queries
            });
        }
        return this;
    };
    Query.prototype.and = function () {
        var queries = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            queries[_i] = arguments[_i];
        }
        this.addComplexQuery('and', queries);
        return this;
    };
    Query.prototype.or = function () {
        var queries = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            queries[_i] = arguments[_i];
        }
        this.addComplexQuery('or', queries);
        return this;
    };
    Query.prototype.neither = function () {
        var queries = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            queries[_i] = arguments[_i];
        }
        this.addComplexQuery('nor', queries);
        return this;
    };
    Query.prototype.nor = function () {
        var queries = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            queries[_i] = arguments[_i];
        }
        this.neither.apply(this, queries);
        return this;
    };
    Query.prototype.merge = function (query) {
        var _a;
        (_a = this.operations).push.apply(_a, query.operations);
        return this;
    };
    Query.prototype.where = function (field, operator, value) {
        this.operations.push({
            field: field,
            operator: operator,
            value: value
        });
        return this;
    };
    Query.prototype.orderBy = function (field, ascending) {
        if (ascending === void 0) { ascending = 'asc'; }
        this._order = {
            field: field,
            ascending: ascending.startsWith('asc')
        };
        return this;
    };
    Query.prototype.limit = function (count) {
        this._limit = count;
        return this;
    };
    Query.prototype.asFilter = function () {
        var _a;
        var filter = {};
        for (var _i = 0, _b = this.operations; _i < _b.length; _i++) {
            var _c = _b[_i], field = _c.field, operator = _c.operator, value = _c.value;
            filter[field] = (_a = {},
                _a["$" + operators[operator]] = value,
                _a);
        }
        for (var _d = 0, _e = this.complexOperations; _d < _e.length; _d++) {
            var operation = _e[_d];
            var operator = operation.operator;
            if (isSingleQuery(operation)) {
                filter["$" + operator] = operation.query.asFilter();
            }
            else {
                filter["$" + operator] = operation.queries.map(function (i) { return i.asFilter(); });
            }
        }
        return filter;
    };
    Query.prototype.get = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var filter, cursor;
            return __generator(this, function (_a) {
                filter = this.asFilter();
                cursor = this.collection.find(filter, options);
                if (this._limit) {
                    cursor.limit(this._limit);
                }
                if (this._order) {
                    cursor.sort(this._order.field, this._order.ascending ? 1 : -1);
                }
                return [2 /*return*/, cursor
                        .toArray()
                        .then(function (i) { return i.map(function (doc) {
                        return {
                            id: doc._id,
                            exists: true,
                            data: function () {
                                return doc;
                            }
                        };
                    }); })];
            });
        });
    };
    Query.prototype.getData = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get(options).then(function (docs) { return docs.map(function (doc) { return doc.data(); }); })];
            });
        });
    };
    return Query;
}());
exports["default"] = Query;
