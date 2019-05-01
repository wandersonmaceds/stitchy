class AluraService{
    
    constructor(httpClient){
        this._httpClient = httpClient;
    }

    async getNoAnsweredTopics() {
        await this._httpClient.get(process.env.FORUM_CLEAN_CACHE);
        const response = await this._httpClient.get(process.env.FORUM_SEM_RESPOSTAS_API)
        return response.data.list;
    }
}