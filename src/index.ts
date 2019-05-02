require('dotenv').config();

import { ReportController } from "./controllers/ReportController";
import { AppController } from "./controllers/AppController";
import { CourseController } from "./controllers/CourseController";
import { IndicatorController } from "./controllers/IndicatorController";

const express = require('express');
const cheerio = require('cheerio');

const app = express();

app.use('/', new AppController(express.Router()).getRoutes());
app.use('/report', new ReportController(express.Router()).getRoutes());
app.use('/courses', new CourseController(express.Router()).getRoutes());
app.use('/indicators', new IndicatorController(express.Router()).getRoutes());

// app.get('/update/users-courses', async (request, response) => {
//   try{

//     const headers = { headers: { 'Accept' : 'text/html' } };
//     const publicProfileURL = process.env.ALURA_PUBLIC_PROFILE;

//     await db.query('DELETE FROM users_courses');
    
//     const queryData = await db.query('SELECT * FROM users');
//     const users = queryData.rows;
    
//     const requests = users.map(user => {
//       const profileURL = publicProfileURL + user.alura_handle;
//       return httpClient.get(profileURL, headers);
//     });
    
//     const responses = await httpClient.all(requests);
    
//     responses.forEach(async userProfileResponse => {
//       const currentUser = users.find(is => userProfileResponse.config.url.includes(is.alura_handle))
//       const $ = cheerio.load(userProfileResponse.data);
//       const coursesCodes = Array.from($(`.${process.env.ALURA_COURSE_SELECTOR}`)).map((e : CheerioElement) => `'${e.attribs.href.substr(8)}'`);
//       const coursesIds = await db.query(`SELECT id from courses WHERE code IN (${coursesCodes.join(',')})`);
//       const queryData = coursesIds.rows.map(c => `(${currentUser.id}, ${c.id})`).join(',');
//       const query = `INSERT INTO users_courses(user_id, course_id) VALUES ${queryData}`;
//       await db.query(query);
//     });

//     response.send('deu bom atualizando os cursos dos moderadores')
//   } catch(e){
//     console.log(e);
//     response.send('deu ruim atualizando os cursos dos moderadores');
//   }
// });

app.listen(process.env.PORT || 4000, () => console.log('running'));