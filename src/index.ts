require('dotenv').config();

import { ReportController } from "./controllers/ReportController";

const express = require('express');
const cheerio = require('cheerio');



const app = express();

const slackAPIToken = process.env.SLACK_TOKEN;
  

app.get('/', (request, response) => {
  response.send('estou vivo beibi!');
});

app.use('/report', new ReportController(express.Router()).getRoutes());
// app.get('/update/courses', async (request, response) => {
//   try{
//     const apiResponse = await httpClient.get(process.env.ALURA_COURSES);
//     const apiCourses = apiResponse.data.map(course => ({ id: course.id, code: course.slug }));
//     await db.query('DELETE FROM users_courses');
//     await db.query('DELETE FROM courses');
//     const coursesSQL = apiCourses.map(c => `(${c.id},'${c.code}')`).join(', ');
//     await db.query(`INSERT INTO courses (id, code) VALUES ${coursesSQL}`);
//     response.send('updating courses');
//   } catch(e){
//     console.log(e)
//     response.send('deu ruim no update dos cursos');
//   }
// });

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