import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import * as indexRouter from './routes/index.js';
import * as actionsRouter from './routes/actions.js';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(path.dirname('')), 'public')));

app.use('/', indexRouter.router);
app.use('/actions', actionsRouter.router);

export {app};
