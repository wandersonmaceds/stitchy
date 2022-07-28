import 'dotenv/config';
import * as express from 'express';

import { ReportController } from "./src/controllers/ReportController";
import { AppController } from "./src/controllers/AppController";
import { CourseController } from "./src/controllers/CourseController";
import { IndicatorController } from "./src/controllers/IndicatorController";
import { UserController } from "./src/controllers/UserController";

const app = express();

app.use('/', new AppController(express.Router()).getRoutes());
app.use('/user', new UserController(express.Router()).getRoutes())
app.use('/report', new ReportController(express.Router()).getRoutes());
app.use('/course', new CourseController(express.Router()).getRoutes());
app.use('/indicators', new IndicatorController(express.Router()).getRoutes());

app.listen(process.env.PORT || 4000, () => console.log('running'));