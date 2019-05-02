import { HttpClient } from "../helpers/HttpClient";

export class IndicatorService{
    
    private httpClient: HttpClient;
    private indicatorsURI: string;

    constructor(httpClient: HttpClient){
        this.httpClient = httpClient;
        this.indicatorsURI = process.env.INDICATORS_SHEETS_URI;
    }

    async getAll(){
        const responseApi = await this.httpClient.get(this.indicatorsURI);
        const users : any = {};

        const responseMapped = responseApi.data.split('\r\n').map(line => {
            const [name, username, posts, date] = line.split(',');
            return { name, username, posts, date };
        }).slice(1);


        responseMapped.forEach(rm => {
            const user = users[rm.username];
            const indicators = { posts: rm.posts, date: rm.date };
            if(user){
                user.indicators.push(indicators);
            } else {
                users[rm.username] = { username: rm.username, name: rm.name, indicators: [ indicators ] };
            }
        })

        return Object.values(users);
    }

}