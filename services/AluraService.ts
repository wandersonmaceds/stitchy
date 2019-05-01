import { HttpClient } from "../helpers/HttpClient";
import { Topic } from "../dto/Topic";

export class AluraService{

    private httpClient: HttpClient;

    constructor(httpClient: HttpClient){
        this.httpClient = httpClient;
    }

    async getNoAnsweredTopics() : Promise<Topic[]> {
        await this.httpClient.get(process.env.FORUM_CLEAN_CACHE);
        const response = await this.httpClient.get(process.env.FORUM_SEM_RESPOSTAS_API);
        return response.data.list;
    }
}