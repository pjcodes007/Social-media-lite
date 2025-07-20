import { connectDB } from "./db/db.js";
import express from 'express';
import profileRouter from './routes/user.route.js';
import photoRouter from "./routes/photo.route.js";
//Connect Database
connectDB();

//Middlewares
const app = express();
app.use(express.json());

//Routes
app.use('/users', profileRouter);
app.use('/photos', photoRouter);

//Adding Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` ✅Server is running on port ${PORT}`);
});