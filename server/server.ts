import express, {Express, Request, Response} from "express";
import mongoose, {Connection} from "mongoose";
import cors, {CorsOptions} from "cors";
import path from "path"
import dotenv from "dotenv"
import userRouter from "./src/routes/userRouter";
import documentRouter from "./src/routes/documentRouter";

const app: Express = express();
const port = 1234;

dotenv.config()

//Connect MongoDB
const mongoDB: string = "mongodb://127.0.0.1:27017/drivedb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db: Connection = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/api/user", userRouter)
app.use("/api/document", documentRouter)

//Connect frontend with backend
if (process.env.NODE_ENV === "development") {
    const corsOptions: CorsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
} else if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("..", "client", "build")))
    app.get("/{*splat}", (req: Request, res: Response) => {
        res.sendFile(path.resolve("..", "client", "build", "index.html"))
    })
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(
);
});