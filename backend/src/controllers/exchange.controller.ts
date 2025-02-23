import express, { Request, Response } from "express";
import axios from "axios"
// import db from "../../models"
// import { v4 as uuidv4 } from 'uuid';
// const newUuid = uuidv4();

const app = express();

export const getExchange = async (req: Request, res: Response): Promise<any> => {
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
}