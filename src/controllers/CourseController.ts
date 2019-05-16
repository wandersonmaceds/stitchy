import { Controller } from "./Controller";
import { HttpClient } from "../helpers/HttpClient";
import { AluraService } from "../services/AluraService";
import { CourseDAO } from "../dao/CourseDAO";
import { ConnectionFactory } from "../dao/ConnectionFactory";

export class CourseController implements Controller{
    
    private router;
    private aluraService : AluraService;
    private courseDao : CourseDAO;

    constructor(router){
        this.router = router;
        this.router.get('/update-from-api', this.updateFromApi.bind(this));
        this.aluraService = new AluraService(new HttpClient());
        this.courseDao = new CourseDAO(new ConnectionFactory().getInstance());
    }

    async updateFromApi(request, response){
        try{
            const courses = await this.aluraService.getCourses();
            await this.courseDao.updateAll(courses);
            
            response.send('Courses updated :)');
        } catch(e){
            console.log(e)
            response.send('Courses were not updated :(');
        }
    }

    getRoutes() {
        return this.router;
    }
}