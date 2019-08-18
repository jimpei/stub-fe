// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   console.log("debug");
//   //   console.dir(request);

//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const express = require("express");

const app = express();

app.get("/*", (req, res) => {
  console.log("debug");
  console.dir(req.params);
  requestUri = req.params;

  // 本来はここでFireStoreとかからデータ取ってくるよ
  const users = [
    { id: 1, name: "hoge" },
    { id: 2, name: "fuga" },
    { id: 3, name: "piyo" },
    { id: 4, name: "fugaaaa" }
  ];

  // データを返却
  res.send(JSON.stringify(users));
  // response.send("ssss");
});

const api = functions.https.onRequest(app);
module.exports = { api };
