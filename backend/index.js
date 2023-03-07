import express from 'express';
import cors from 'cors';
const app = express();
const port = 8000;
import { urls, store } from './utils/urlStore.js'
import { generateString } from './utils/urlBuilder.js';
import { insertOne, findOne, findOneAndUpdate } from './utils/db/queries.js';

app.use(express.json());
app.use(cors());

app.get('/url/:id', async (req, res) => {
    const query = await findOne("shortURL", req.params.id);
    console.log(query);
    if(query) {
        const result = {id: query.shortURL, originalURL: query.origURL, visitCount: query.count};
        res.status(200).send(result);
        
    } else {
        res.status(404).send();
    }
});

app.post('/url', async (req, res) => {
    const checkDupes = await findOne("origURL", req.body.url);
    if(checkDupes) {
        
        res.status(200).send({id: checkDupes.shortURL, originalURL: checkDupes.origURL, visitCount: checkDupes.count})
    } else {
        const string = generateString();
        const result = Promise.resolve(insertOne({shortURL: string, origURL: req.body.url, count: 0}))
        result.then(value => {
            console.log('value',value);
            if(value.acknowledged === true) {
                
                res.status(201).send({ "id": string, "originalURL": req.body.url, "visitCount": 0})
            }
        });
    }
})

app.post('/url/:id/visit', async (req, res) => {
    const query = await findOneAndUpdate(req.params.id);
    console.log(query.value);
    if(query.value) {
        const result = {id: query.value.shortURL, originalURL: query.value.origURL, visitCount: query.value.count};
        res.status(200).send(result);
        
    } else {
        res.status(404).send();
    }
})

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))