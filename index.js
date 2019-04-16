const fs = require('fs');
const path = require('path');
const revisors = require('./revisors');
const internalSupport = require('./internal-support');

const filePath = path.resolve(__dirname, 'data/sem-solucao.json');
let posts = JSON.parse(fs.readFileSync(filePath, { encoding: 'UTF-8' })).list;

function buildMessage(user, topics){
    const baseUrl = 'https://cursos.alura.com.br';
    const mappedTopic = topics.map((topic, index) => `Tópico: ${index + 1}\nTempo de espera: ${topic.days} dias\nTítulo: ${topic.title}\nURL: ${baseUrl + topic.link}\n\n`)
    return `Oi ${user}, separei esses tópicos pra gente ver hoje.\n\n${mappedTopic.join('')}`
}


internalSupport.forEach(user => {
  const internalAlert = []
  
  user.courses.forEach(course => {
      internalAlert.push(...(posts.filter(post => post.courseCode == course)));
      posts = posts.filter(post => !internalAlert.includes(post))

      if(internalAlert.length >= 10)
        return;
  });

  if(internalAlert.length){
    console.log(buildMessage(user.name, internalAlert));  
  }
})