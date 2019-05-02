import { HttpClient } from "../helpers/HttpClient";
import { Topic } from "../dto/Topic";
import { Course } from "../dto/Course";

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

    async getCourses() : Promise<Course[]> {
        const apiResponse = await this.httpClient.get(process.env.ALURA_COURSES);
        const apiCourses = apiResponse.data.map(course => ({ id: course.id, code: course.slug }));
        return apiCourses;
    }
}