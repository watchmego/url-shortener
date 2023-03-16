import process from "node:process";
import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

import { generateString } from "./utils/urlBuilder.js";
import {
  insertURL,
  findURL,
  incrementURLVisitCount,
} from "./utils/db/queries.js";

//create express instance & define port to bind to
const app = express();
const port = 8000;

//middleware setup
app.use(express.json());
app.use(cors());

//mongoDB settings
const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBURL}?retryWrites=true&w=majority`;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const dbName = "urlShortener";
//used with the exit process handler
let exiting = false;

//create and run DB connection
const connectDB = async () => {
  await client.connect();

  const db = client.db(dbName);
  return db.collection("urls");
};

//query DB for shortURL ID
app.get("/url/:id", async (req, res, next) => {
  try {
    const query = await findURL(collection, "shortURL", req.params.id);
    if (query) {
      const result = {
        id: query.shortURL,
        originalURL: query.origURL,
        visitCount: query.count,
      };
      res.status(200).send(result);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});

//create new shortened URL
app.post("/url", async (req, res, next) => {
  try {
    //see if it already exists
    const checkDupes = await findURL(collection, "origURL", req.body.url);
    if (checkDupes) {
      const record = {
        id: checkDupes.shortURL,
        originalURL: checkDupes.origURL,
        visitCount: checkDupes.count,
      };
      res.status(200).send(record);
    } else {
      const string = generateString();
      const result = await insertURL(collection, {
        shortURL: string,
        origURL: req.body.url,
        count: 0,
      });
      if (result.acknowledged === true) {
        res
          .status(201)
          .send({ id: string, originalURL: req.body.url, visitCount: 0 });
      }
    }
  } catch (err) {
    next(err);
  }
});

//increment visited counter when URL is used
app.post("/url/:id/visit", async (req, res, next) => {
  try {
    const query = await incrementURLVisitCount(collection, req.params.id);
    if (query.value) {
      const result = {
        id: query.value.shortURL,
        originalURL: query.value.origURL,
        visitCount: query.value.count,
      };
      res.status(200).send(result);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});

//express error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Request failed" });
};

//exit handler middleware
const exitHandler = () => {
  //check if already exiting (e.g. ctrl+c double kill behaviour)
  if (exiting) {
    return;
  }
  exiting = true;

  console.log("Closing MongoDB connection...");
  client
    .close()
    .then(() => {
      console.log("MongoDB connection closed.");
      process.exit();
    })
    .catch((err) => {
      console.error("Error closing MongoDB connection:", err);
      process.exit(1);
    });
};
//initialise error handler middleware
app.use(errorHandler);

//process exit listeners
process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);

//connect DB & express server

let collection;
(async () => {
  try {
    collection = await connectDB();
    app.listen(port, () => {
      console.log(`Hello world app listening on port ${port}!`);
    });
  } catch (e) {
    console.log(e);
    process.exit();
  }
})();
