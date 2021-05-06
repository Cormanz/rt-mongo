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
var mongodb_1 = require("mongodb");
var Document = /** @class */ (function () {
    function Document(collection, id) {
        this.collection = collection;
        this.id = id;
    }
    Document.prototype.set = function (content, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!opts.merge) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.findOneAndUpdate({
                                _id: new mongodb_1.ObjectId(this.id)
                            }, content)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.collection.findOneAndReplace({
                            _id: new mongodb_1.ObjectId(this.id)
                        }, content)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Document.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var collection, findResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.collection;
                        return [4 /*yield*/, collection.findOne({ _id: this.id })];
                    case 1:
                        findResult = _a.sent();
                        return [2 /*return*/, {
                                id: this.id,
                                exists: findResult !== undefined,
                                data: function () {
                                    return findResult;
                                }
                            }];
                }
            });
        });
    };
    Document.prototype.getData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get().then(function (i) { return i.data(); })];
            });
        });
    };
    Document.prototype.update = function (content) {
        return this.set(content, { merge: true });
    };
    Document.prototype.onSnapshot = function (callback) {
        var document = this;
        var stream = this.collection.watch();
        stream.on('change', function (doc) {
            var anyDoc = doc;
            var id = anyDoc.documentKey._id.toString();
            //Note: Using != because JS throws a fit otherwise.
            if (id != document.id) {
                return;
            }
            var operationType = doc.operationType;
            switch (operationType) {
                case 'update':
                    // @ts-ignore
                    callback({
                        id: id,
                        exists: true,
                        change: anyDoc.updateDescription
                    });
            }
        });
    };
    return Document;
}());
exports["default"] = Document;