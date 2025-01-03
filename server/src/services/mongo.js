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
const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready!");
});
mongoose.connection.on("error", (err) => {
    console.error(err);
});
function mongoConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect(MONGO_URL);
    });
}
function mongoDisconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.disconnect();
    });
}
module.exports = {
    mongoConnect,
    mongoDisconnect,
};
