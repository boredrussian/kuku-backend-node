import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import entry from "./middleware/entry";
import routes from "./service/index";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd() + "/.env.development") });

const app = express();
const port = process.env.PORT || 4000;

let interval: any;
applyMiddleware(entry, app);
applyRoutes(routes, app);
app.listen(port, () => console.log(`Listening on port ${port}`));
