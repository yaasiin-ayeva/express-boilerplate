import Env from "./configs/config";
import { AppDataSource } from "./data-source";
import apiRouter from "./routes/index.route";
import ErrorResponse from "./utils/errorResponse.util";
import rateLimit from "express-rate-limit";
import { NextFunction, Request, Response } from "express";

import express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

const publicContent = require('../app.json');

const PORT = Env.APP_PORT || 3890;

const cors = require('cors');
const whitelist = ['capacitor://localhost', 'http://localhost'];

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1) {
            console.log('origin: ' + origin + ' is allowed by CORS');
            callback(null, true);
        } else {
            console.log('origin: ' + origin + ' is not allowed by CORS');
            callback(new ErrorResponse('Not allowed by CORS', 403));
        }
    }
}

const apiLimiter = rateLimit({  // Limit each IP to 100 requests per `window` (here, per 10 minutes)
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
});

AppDataSource.initialize().then(async () => {
    console.log('Datasource initialized');
}).catch((error => {
    console.log(error);
}));

const app = express();

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Rate limit
app.use(apiLimiter);

app.use(morgan('combined'));     // Dev logging middleware

if (process.env.NODE_ENV === 'development') {
    app.use(cors());
}

if (process.env.NODE_ENV === 'production') {
    app.use(cors(corsOptions));
}

app.use('/assets', express.static('assets'));
app.use('/api/v1/', apiRouter);

app.get('/', (_, res) => {
    res.send(publicContent);
});

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}\n`);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500;

    console.log('error:', error.message);
    console.log('statusCode:', statusCode);

    return res.status(statusCode).json({
        success: false,
        message: error.message
    });
});
