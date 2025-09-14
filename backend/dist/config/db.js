"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(colors_1.default.bgCyan.white(`MongoDB Connected: ${conn.connection.host}`));
    }
    catch (error) {
        console.error(colors_1.default.bgRed.white(`Error: ${error.message}`));
        process.exit(1); // Exit process with failure
    }
};
exports.default = connectDB;
