import axios from 'axios';

export class HttpClient{
    get(path: string, config?: {}) : Promise<any> {
        return axios.get(path, config);
    }
}