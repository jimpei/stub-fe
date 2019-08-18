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
  let requestUri = req.params[0];

  if (requestUri == "") {
    // 登録情報参照
    console.log("all mode.");
    getAll(fireStore, "stubs").then(data => {
      res.json(data);
    });
  } else {
    console.log("simple mode." + requestUri);
    simpleQuery(fireStore, "stubs", "entryPoint", "/" + requestUri).then(
      data => {
        if (data == "" || data.length > 1) {
          // 登録外のエントリポイントの場合、または登録エントリポイントが重複
          console.log("error. entry point not reg or duplicate");
          res.json("");
          return;
        }
        res.json(data);
      }
    );
  }
});

function getAll(db, collectionName) {
  let dbRef = db.collection(collectionName);
  let allData = dbRef
    .get()
    .then(snapshot => {
      let array = [];
      snapshot.forEach(doc => {
        // console.log(doc.id, "=>", doc.data());
        let tmpArray = JSON.parse(JSON.stringify(doc.data()));
        array.push(tmpArray);
      });
      // console.dir(array);
      return array;
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });

  return allData;
}

function simpleQuery(db, collectionName, fieldName, field) {
  console.log(fieldName + "," + field);
  let dbRef = db.collection(collectionName);
  let simpleData = dbRef
    .where(fieldName, "==", field)
    .get()
    .then(data => {
      if (data.empty) {
        console.log("No such document!");
        return "";
      }
      let array = [];
      data.forEach(doc => {
        // console.log(doc.id, "=>", doc.data());
        let tmpArray = JSON.parse(JSON.stringify(doc.data()));
        array.push(tmpArray);
      });
      // console.dir(array);
      return array;
    })
    .catch(err => {
      console.log("err." + err);
    });

  return simpleData;
}

app.post("/add", (req, res) => {
  var citiesRef = fireStore.collection("stubs");
  citiesRef.doc("aaa").set({
    entryPoint: "/hogehoge",
    httpStatusCode: "200",
    response: {
      hoge: "1",
      "2": "fuga"
    }
  });
  res.send("db insert ok.");
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
