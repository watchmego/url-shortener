import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import "dotenv/config";

const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBURL}?retryWrites=true&w=majority`;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const dbName = "urlShortener";

const connectDB = async () => {
  await client.connect();

  const db = client.db(dbName);
  return db.collection("urls");
};

export const insertURL = async (record) => {
  let result;
  try {
    let collection = await connectDB();

    let doc = {
      _id: new ObjectId(),
      shortURL: record.shortURL,
      origURL: record.origURL,
      count: record.count,
    };
    result = await collection.insertOne(doc);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
    return result;
  }
};

export const findURL = async (key, value) => {
  let result;
  try {
    let collection = await connectDB();

    let query = { [key]: value };
    result = await collection.findOne(query);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
    return result;
  }
};

export const incrementURLVisitCount = async (url) => {
  let result;
  try {
    let collection = await connectDB();

    let query = { shortURL: url };
    let update = { $inc: { count: 1 } };
    result = await collection.findOneAndUpdate(query, update);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
    return result;
  }
};
