"use strict";
// import { createClient } from "redis";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const client = createClient();
// async function main() {
//   await client.connect(); /// Connecting to the redis client
//   while (1) {
//     const response = await client.brPop("submission", 0); // brPop is the blocking POP which means stay blocked until you receive something on the submission queue...
//     /// In this step we will actually run the users code....
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     //// Send it to the pub sub
//     console.log("Processed the users submission");
//   }
// }
// main();
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function processSubmission(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        const { problemId, code, language } = JSON.parse(submission);
        console.log(`Processing submission for problemId ${problemId}...`);
        console.log(`Code: ${code}`);
        console.log(`Language: ${language}`);
        // Here you would add your actual processing logic
        // Simulate processing delay
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`Finished processing submission for problemId ${problemId}.`);
        client.publish("problem_done", JSON.stringify({ problemId, status: "TLE" }));
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Worker connected to Redis.");
            // Main loop
            while (true) {
                try {
                    const submission = yield client.brPop("problems", 0);
                    // @ts-ignore
                    yield processSubmission(submission.element);
                }
                catch (error) {
                    console.error("Error processing submission:", error);
                    // Implement your error handling logic here. For example, you might want to push
                    // the submission back onto the queue or log the error to a file.
                }
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
startWorker();
