import { HttpClient } from "../helpers/HttpClient";

class AluraService{
    
    private httpClient: HttpClient;

    constructor(httpClient: HttpClient){
        this.httpClient = httpClient;
    }

    async getNoAnsweredTopics() {
        await this.httpClient.get(process.env.FORUM_CLEAN_CACHE);
        const response = await this.httpClient.get(process.env.FORUM_SEM_RESPOSTAS_API)
        return response.data.list;
    }
}