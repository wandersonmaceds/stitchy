const revisors = require('./revisors');
const internalSupport = require('./internal-support');
const axios = require('axios');
const express = require('express');

app = express();

require('dotenv').config();


const slackAPIToken = process.env.SLACK_TOKEN;
  
function buildMessage(user, topics){
  const baseUrl = 'https://cursos.alura.com.br';
  const mappedTopic = topics.slice(0, 10).map((topic, index) => `Tópico: ${index + 1}\nTempo de espera: ${topic.days} dias\nTítulo: ${topic.title}\nURL: ${baseUrl + topic.link}\n\n`)
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

app.get('/report/internal', (request, resp) => {
  axios.get(process.env.FORUM_CLEAN_CACHE)
  .then(response => {
    axios.get(process.env.FORUM_SEM_RESPOSTAS_API)
      .then(response => response.data.list)
      .then(posts => {
      internalSupport.forEach(user => {
        const internalAlert = []
        
        user.courses.forEach(course => {
          internalAlert.push(...(posts.filter(post => post.courseCode == course)));
          posts = posts.filter(post => !internalAlert.includes(post))
          
          if(internalAlert.length >= 10){
            return;
          }
        });
        
        if(internalAlert.length){
          let message = buildMessage(user.name, internalAlert);
          sendMessage(user.id, message);
          sendMessage('CJ0DNN86L', `dúvidas enviadas para ${user.name}`);
        }
      });
      resp.send('enviando tópicos');
    })
    .catch(error => {
      console.log(error);
      response.send('deu ruim!');
    });
  })
  .catch(error => console.log(error));
})

app.listen(process.env.PORT || 4000, () => console.log('running'));