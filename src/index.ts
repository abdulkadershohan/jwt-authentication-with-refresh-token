import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import connectDB from "./config/db.config";
import errorHandler from "./middlewares/defaultErrorHandler";
import router from "./routes/routes";
// Create the express app and  import the type of app from express;
const app: Application = express();

// Cors
app.use(cors());
//configure env;
dotenv.config();
// Parser
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
// Declare The PORT 
const PORT = process.env.PORT || 8000;

// application routes
app.use("/api", router);

// default error handler
app.use(errorHandler);
// Listen the server
app.listen(PORT, async () => {
    console.log(`🗄️  Server Fire on http:localhost//${PORT}`);

    // Connect To The Database
    connectDB();
});
