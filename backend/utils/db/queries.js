import { ObjectId } from "mongodb";
import "dotenv/config";


export const insertURL = async (collection, record) => {
  let result;
  try {
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
    return result;
  }
};

export const findURL = async (collection, key, value) => {
  let result;
 
  try {
    let query = { [key]: value };
    result = await collection.findOne(query);
  } catch (err) {
    console.log(err.stack);
  } finally {
    return result;
  }
};

export const incrementURLVisitCount = async (collection, url) => {
  let result;
  try {
    let query = { shortURL: url };
    let update = { $inc: { count: 1 } };
    result = await collection.findOneAndUpdate(query, update);
  } catch (err) {
    console.log(err.stack);
  } finally {
    return result;
  }
};
