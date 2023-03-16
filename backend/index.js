import express from "express";
import cors from "cors";
const app = express();
const port = 8000;
import { generateString } from "./utils/urlBuilder.js";
import { insertURL, findURL, incrementURLVisitCount } from "./utils/db/queries.js";

app.use(express.json());
app.use(cors());

app.get("/url/:id", async (req, res) => {
    try {
        const query = await findURL("shortURL", req.params.id);
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
    } catch(err) {
        next(err);
    }

});

app.post("/url", async (req, res) => {
    try {
        const checkDupes = await findURL("origURL", req.body.url);
        if (checkDupes) {
            const record = {
            id: checkDupes.shortURL,
            originalURL: checkDupes.origURL,
            visitCount: checkDupes.count,
            };
            res.status(200).send(record);
        } else {
            const string = generateString();
            const result = await insertURL({
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
    } catch(err) {
        next(err);
    }
});

app.post("/url/:id/visit", async (req, res) => {
    try {
        const query = await incrementURLVisitCount(req.params.id);
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
            } catch(err) {
            next(err);
    }
});

const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Request failed'})
}

app.use(errorHandler)
app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
