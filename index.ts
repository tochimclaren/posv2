import express from "express";
require("dotenv").config()
const PORT = process.env.PORT || 3000
import db from './models';
const app = express();
app.use(express.json())


db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port: ${PORT}`)
    })
})



