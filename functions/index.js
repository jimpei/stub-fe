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

var admin = require("firebase-admin");
var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stub-fe.firebaseio.com"
});

var fireStore = admin.firestore();

app.get("/*", (req, res) => {
  console.log("debug");
  console.dir(req.params);
  requestUri = req.params;

  let cityRef = fireStore.collection("stubs").doc("RuD8MUmnAW6cFPgkIOb6");
  let getDoc = cityRef
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        console.log("Document data:", doc.data());
        res.json(doc.data());
      }
    })
    .catch(err => {
      console.log("Error getting document", err);
    });
});

app.post("/add", (req, res) => {
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
});

app.post("/hoge", (req, res) => {
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
});

const api = functions.https.onRequest(app);
module.exports = { api };
