require('dotenv').config();

import { ReportController } from "./src/controllers/ReportController";
import { AppController } from "./src/controllers/AppController";
import { CourseController } from "./src/controllers/CourseController";
import { IndicatorController } from "./src/controllers/IndicatorController";
import { UserController } from "./src/controllers/UserController";
import { Controller } from "./src/controllers/Controller";

const express = require('express');
const app = express();

const controllers: Controller[] = [
    new AppController,
    new UserController,
    new CourseController,
    new ReportController,
    new IndicatorController,
];

controllers.forEach(controller => {
    app.use(controller.getBasePath(), controller.getRouter)
})

app.listen(process.env.PORT || 4000, () => console.log('running'));