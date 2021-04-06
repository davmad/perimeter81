import express from "express";
import middleware from "./middleware";
import routes from "./routes";
import errorHandlers from "./middleware/errorHandlers";

// function to iterate and use all middlewares from middleware array
const applyMiddleware = (middlewareWrappers: Wrapper[], router: express.Router) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

const app = express();
applyMiddleware(middleware, app);
app.use("/", routes);
applyMiddleware(errorHandlers, app);

export default app;