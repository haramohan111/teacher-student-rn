"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
// firebase.ts
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebaseServiceKey_json_1 = __importDefault(require("./firebaseServiceKey.json")); // works if "resolveJsonModule": true in tsconfig.json
// Initialize Firebase Admin only once
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(firebaseServiceKey_json_1.default),
        databaseURL: "https://teacher-student-b71ee-default-rtdb.firebaseio.com",
    });
}
exports.db = firebase_admin_1.default.firestore();
exports.auth = firebase_admin_1.default.auth();
