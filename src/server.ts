import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import entry from "./middleware/entry";
import routes from "./service/index";

const app = express();
const port = process.env.PORT || 4000;

let interval: any;

console.log("routes", routes);

// applyMiddleware(entry, app);
applyRoutes(routes, app);
app.listen(port, () => console.log(`Listening on port ${port}`));
