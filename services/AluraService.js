class AluraService{
    
    constructor(httpClient){
        this._httpClient = httpClient;
    }

    async getNoAnsweredTopics() {
        const topics = await this._httpClient.get(process.env.FORUM_SEM_RESPOSTAS_API)
        return topics.list;
    }
}