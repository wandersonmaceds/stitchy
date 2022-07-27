import { HttpClient } from "../helpers/HttpClient";
import { Topic } from "../dto/Topic";
import { Course } from "../dto/Course";
import { User } from "../model/User";
import * as cheerio from 'cheerio';

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
        return apiResponse.data.map(course => ({ id: course.id, code: course.slug }));
    }

    async getCoursesFromProfiles(users: User[]) {
        
        const headers = { headers: { 'Accept' : 'text/html' } };
        const publicProfileURL = process.env.ALURA_PUBLIC_PROFILE;
        const userCoursesSelector = `.${process.env.ALURA_COURSE_SELECTOR}`;
        
        const requests = users.map(user => this.httpClient.get(publicProfileURL + user.alura_handle, headers));
        const responses = await this.httpClient.all(requests);

        return responses.map(userProfileResponse => {
            const currentUser = users.find(is => userProfileResponse.config.url.includes(is.alura_handle))
            const $ = cheerio.load(userProfileResponse.data);
            const coursesCodes = Array.from($(userCoursesSelector)).map((e: any) => `'${e.attribs.href.substr(8)}'`);
            currentUser.courses.splice(0)
            currentUser.courses.push(...coursesCodes);

            return currentUser;
        });
    }
}