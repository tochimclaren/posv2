import express, { Request, Response } from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import compression from 'compression';
import RootRouter from "./app/routers/index"
import { notFoundError } from "./app/middlewares/middleware.404"
// import { v4 as uuidv4 } from 'uuid';
import axios from "axios"

// const newUuid = uuidv4();

require("dotenv").config()
const PORT = process.env.PORT || 4000
import db from './models';
const app = express();
app.use(express.json())
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compression());
app.use(RootRouter)

app.get("/", async (req: Request, res: Response): Promise<any> => {
    return res.status(200).send('healthy server...')
})


app.get('/api/exchange', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Encoding', 'none');
    res.flushHeaders();

    res.write('data: {"message": "Exchange rate service connected!"}\n\n');

    const interval = setInterval(async () => {
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
            const exchangeRate = response.data.rates.NGN;

            const message = `USD1 = NGN${exchangeRate}`;
            res.write(`data: {"message": "${message}", "rate":"${exchangeRate}"}\n\n`,);

            // await db.Exchange.upsert({
            //     id: newUuid,
            //     price: exchangeRate,
            // });

        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            res.write(`data: {"message": "Error fetching exchange rate"}\n\n`);
        }
    }, 10000);

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
});

app.use(notFoundError)

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port: ${PORT}`)
    })
})

export default app