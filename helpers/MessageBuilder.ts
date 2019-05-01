import { Topic } from "../dto/Topic";

export class MessageBuilder{

    static forTopicsOnSlack(username: string, topics: Topic[]) : string {
        const baseUrl = process.env.ALURA_DASHBOAR_BASE_URL;
        
        const topicsString = topics.map((topic, index) => {
            `Tópico: ${index + 1}
            Tempo de espera: ${topic.days} dias
            Título: ${topic.title}
            Curso: ${topic.course}
            URL: ${baseUrl + topic.link}\n\n`
        }).join('');
        
        return `Oi ${username}, separei esses tópicos pra gente ver hoje.\n\n${topicsString}`;
    }
    
}