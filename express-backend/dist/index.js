"use strict";
// import express from "express";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { createClient } from "redis";
// const app = express();
// app.use(express.json());
// const client = createClient(); /// This line lets you to create a redis client...
// client.connect();
// app.post("/submit", async (req, res) => {
//   const { problemId, userId, code, language } = req.body;
//   // After getting the data from the req.body push this to a database prisma.submission().create()...
//   try {
//     await client.lPush(
//       "submission",
//       JSON.stringify({
//         problemId,
//         userId,
//         code,
//         language,
//       })
//     ); /// In this line we are pushing the data to the submission queue...(In other words we are  publishing the data to the queue)
//     res.json({
//       message: "Submission received",
//     });
//   } catch (e) {
//     res.json({
//       message: "Submission failed",
//     });
//   }
// });
// app.listen(3000);
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
client.on("error", (err) => console.log("Redis Client Error", err));
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;
    try {
        yield client.lPush("problems", JSON.stringify({ code, language, problemId }));
        // Store in the database
        res.status(200).send("Submission received and stored.");
    }
    catch (error) {
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Connected to Redis");
            app.listen(3000, () => {
                console.log("Server is running on port 3000");
            });
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
startServer();
