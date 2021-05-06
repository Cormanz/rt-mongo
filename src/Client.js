"use strict";
exports.__esModule = true;
var Database_1 = require("./Database");
var Client = /** @class */ (function () {
    function Client(client) {
        this.client = client;
    }
    Client.prototype.db = function (name, options) {
        return new Database_1["default"](this.client.db(name, options));
    };
    return Client;
}());
exports["default"] = Client;
