const revisors = require('./revisors');
const internalSupport = require('./internal-support');
const axios = require('axios');
const express = require('express');
const { Client } = require('pg');
require('dotenv').config();


const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});
db.connect().catch(err => console.log(err));

app = express();



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
    
    internalSupport.forEach(({id, name, courses}) => {
      
      const criteria = post => courses.find(course => course == post.courseCode);
      const postsToSend = posts.filter(criteria).slice(0, 10);
    
      posts = posts.filter(post => !postsToSend.includes(post));
      
      
      if(postsToSend.length){
        const message = buildMessage(name, postsToSend);
        sendMessage(id, message);
        sendMessage('CJ0DNN86L', `${message}`);
      } else {
        sendMessage(id, `Oi ${name}, não encontrei tópicos para você hoje! :(\nPor favor, dê uma olhada, posso estar enganado: https://cursos.alura.com.br/forum/`)
      }
    });
  } catch(e) {
    console.log(e);    
  }

  response.send('enviando tópicos');

});

app.get('/update/courses', async (request, response) => {
  try{
    const apiResponse = await axios.get('https://cursos.alura.com.br/api/cursos');
    const apiCourses = apiResponse.data.map(course => ({ id: course.id, code: course.slug }));
    await db.query('DELETE FROM courses');
    const coursesSQL = apiCourses.map(c => `(${c.id},'${c.code}')`).join(', ');
    await db.query(`INSERT INTO courses (id, code) VALUES ${coursesSQL}`);
    response.send('updating courses');
  } catch(e){
    console.log(e)
    response.send('deu ruim no update dos cursos');
  }
})

app.listen(process.env.PORT || 4000, () => console.log('running'));