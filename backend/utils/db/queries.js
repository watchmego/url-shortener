import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import "dotenv/config"

const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBURL}?retryWrites=true&w=majority`
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const dbName = "urlShortener";

export const insertOne = async (record) => {
    console.log('running insert one');
    let result;
    try {
        await client.connect();
        console.log('connecting to mongo');
    
        const db = client.db(dbName);
        let collection = db.collection("urls");

        let doc = {_id: new ObjectId(), shortURL: record.shortURL, origURL: record.origURL, count: record.count };
    
        result = await collection.insertOne(doc);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
        return result;

    };
    
}
//insertOne({shortURL: 123456, origURL: 'test'}).catch(console.dir);

export const findOne = async (key, value) => {
    let result;
    try {
        await client.connect();
    
        const db = client.db(dbName);
        
        let collection = db.collection("urls");
        let query = { [key]: value }
    
        result = await collection.findOne(query)
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
        return result;

    };
}

export const findOneAndUpdate = async (url) => {
    let result;
    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection("urls");
        let query = { shortURL: url };
        let update = {$inc: {"count": 1}};

        result = await collection.findOneAndUpdate(query, update);
        console.log(result);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
        return result;
    }
 }