const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const { Client } = require('pg');
require('dotenv').config();

app = express();

const db = new Client({ connectionString: process.env.DATABASE_URL });

db.connect().catch(err => console.log(err));



const slackAPIToken = process.env.SLACK_TOKEN;
  
function buildMessage(user, topics){
  const baseUrl = 'https://cursos.alura.com.br';
  const mappedTopic = topics.map((topic, index) => `Tópico: ${index + 1}\nTempo de espera: ${topic.days} dias\nTítulo: ${topic.title}\nURL: ${baseUrl + topic.link}\n\n`)
  return `Oi ${user}, separei esses tópicos pra gente ver hoje.\n\n${mappedTopic.join('')}`
}

function sendMessage(user, message){
  axios.get('https://slack.com/api/chat.postMessage', {
    params: {
      token: slackAPIToken,
      channel: user,
      text: message,
      username: 'Stitch',
      icon_url: 'https://i.imgur.com/2WOJif0.png'
    }
  })
  .then(response => console.log(response))
  .catch(error => console.log(error));
}

app.get('/', (request, response) => {
  response.send('estou vivo beibi!');
});

app.get('/report/internal', async (request, response) => {
  try{
    await axios.get(process.env.FORUM_CLEAN_CACHE)
    const apiResponse = await axios.get(process.env.FORUM_SEM_RESPOSTAS_API);
    let posts = apiResponse.data.list;
    const query = 'SELECT u.id, u.priority_alert, u.slack_handle, u.name, c.code FROM users u, users_courses uc, courses c WHERE uc.user_id = u.id AND uc.course_id = c.id ORDER BY u.priority_alert, u.id'
    const queryResult = await db.query(query);
    const users = queryResult.rows.reduce((ac, current) => {
      const user = ac[current.id] ? ac[current.id] : { id: current.id, slack_handle: current.slack_handle, name: current.name, priority_alert: current.priority_alert, courses: [] };
      user.courses.push(current.code);
      ac[current.id] === undefined ? ac[current.id] = user : ac.splice(current.id, 1, user);
      return ac;
    }, []);

    users.sort((u1, u2) => u1.priority_alert - u2.priority_alert);
    // users.forEach(u => console.log(u.id, u.priority_alert, u.name, u.courses.length));

    users.forEach(({slack_handle, name, courses}) => {
      
      const criteria = post => courses.find(course => course == post.courseCode);
      const postsToSend = posts.filter(criteria).slice(0, 10);
    
      posts = posts.filter(post => !postsToSend.includes(post));
      
      
      if(postsToSend.length){
        const message = buildMessage(name, postsToSend);
        sendMessage(id, message);
        sendMessage('CJ0DNN86L', `${message}`);
      } else {
        const message = `Oi ${name}, não encontrei tópicos para você hoje! :(\nPor favor, dê uma olhada, posso estar enganado: https://cursos.alura.com.br/forum/`;
        sendMessage('CJ0DNN86L', `${message}`);
        sendMessage(id, message)
      }
    });
  } catch(e) {
    console.log(e);    
  }

  response.send('enviando tópicos');

});
app.get('/update/courses', async (request, response) => {
  try{
    const apiResponse = await axios.get(process.env.ALURA_COURSES);
    const apiCourses = apiResponse.data.map(course => ({ id: course.id, code: course.slug }));
    await db.query('DELETE FROM users_courses');
    await db.query('DELETE FROM courses');
    const coursesSQL = apiCourses.map(c => `(${c.id},'${c.code}')`).join(', ');
    await db.query(`INSERT INTO courses (id, code) VALUES ${coursesSQL}`);
    response.send('updating courses');
  } catch(e){
    console.log(e)
    response.send('deu ruim no update dos cursos');
  }
});

app.get('/update/users-courses', async (request, response) => {
  try{

    const headers = { headers: { 'Accept' : 'text/html' } };
    const publicProfileURL = process.env.ALURA_PUBLIC_PROFILE;

    await db.query('DELETE FROM users_courses');
    
    const queryData = await db.query('SELECT * FROM users');
    const users = queryData.rows;
    
    const requests = users.map(user => {
      const profileURL = publicProfileURL + user.alura_handle;
      return axios.get(profileURL, headers);
    });
    
    const responses = await axios.all(requests);
    
    responses.forEach(async userProfileResponse => {
      const currentUser = users.find(is => userProfileResponse.config.url.includes(is.alura_handle))
      const $ = cheerio.load(userProfileResponse.data);
      const coursesCodes = Array.from($(`.${process.env.ALURA_COURSE_SELECTOR}`)).map(e => `'${e.attribs.href.substr(8)}'`);
      const coursesIds = await db.query(`SELECT id from courses WHERE code IN (${coursesCodes.join(',')})`);
      const queryData = coursesIds.rows.map(c => `(${currentUser.id}, ${c.id})`).join(',');
      const query = `INSERT INTO users_courses(user_id, course_id) VALUES ${queryData}`;
      await db.query(query);
    });

    response.send('deu bom atualizando os cursos dos moderadores')
  } catch(e){
    console.log(e);
    response.send('deu ruim atualizando os cursos dos moderadores');
  }
});

app.listen(process.env.PORT || 4000, () => console.log('running'));