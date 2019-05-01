import { Topic } from "./../dto/Topic";

export class MessageBuilder{

    static forTopicsOnSlack(username: string, topics: Topic[]) : string {
        return topics.length > 0 
            ? MessageBuilder.buildMessageWithTopicList(username, topics)
            : MessageBuilder.buildMessageWithNoTopics(username);
    }

    private static buildMessageWithNoTopics(username: string): string {
        return `Oi ${username}, não encontrei tópicos para você hoje! :(\nPor favor, dê uma olhada, posso estar enganado: https://cursos.alura.com.br/forum/`;
    }
    
    private static buildMessageWithTopicList(username: string, topics: Topic[]) {
        const baseUrl = process.env.ALURA_DASHBOAR_BASE_URL;
        
        const topicsString = topics.map((topic, index) => {
            return  `Tópico: ${index + 1}\nTempo de espera: ${topic.days} dias\nTítulo: ${topic.title}\nCurso: ${topic.course}\nURL: ${baseUrl + topic.link}\n\n`;
        }).join('');

        return `Oi ${username}, separei esses tópicos pra gente ver hoje.\n\n${topicsString}`;
    }
    
}