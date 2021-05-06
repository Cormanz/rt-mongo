"use strict";
exports.__esModule = true;
var Collection_1 = require("./Collection");
var Database = /** @class */ (function () {
    function Database(db) {
        this.db = db;
    }
    Database.prototype.collection = function (name) {
        return new Collection_1["default"](this.db.collection(name));
    };
    return Database;
}());
exports["default"] = Database;
