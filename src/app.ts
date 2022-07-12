import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import compression from "compression";
import httpStatus from "http-status";
import passport from "passport"

import {default as conf, accessLogStream} from "./config";
import route from "./routes";
import { apiLimiter } from "./middlewares/rate-limit";
import { errorConverter, errorHandler, APIError} from "./middlewares/error";

const app = express();
app.locals.cargoPrefix = "cargo-projects/cosm";

app.use(apiLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const sessOpt: session.SessionOptions = {
    saveUninitialized: false,
    secret: conf.sessSecret as string,
    resave: false,
    cookie: { secure: false },
};

const corsOpts = {
    credentials: true,
};
if (conf.nodeEnv == "production") {
    app.use(cors(corsOpts));
    app.set("trust proxy", 1);
    if (sessOpt.cookie) {
        sessOpt.cookie.maxAge = 1000 * 60 * 60 * 2;
    }

    app.use(
        morgan("combined", {
            skip: (req, res) => {
                return res.statusCode < 400;
            },
        })
    );
} else {
    app.use(cors());
    // app.use(morgan("dev"));
    app.use(morgan("common", { stream: accessLogStream }));
}

app.use(session(sessOpt));
app.use(passport.authenticate("session"));

app.use(helmet());
app.use(compression());

app.use(
    "/",
    (req, res, next) => {
        next();
    },
    route
);

app.use((req, res, next) => {
    next(new APIError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorConverter);
app.use(errorHandler);

export default app;
