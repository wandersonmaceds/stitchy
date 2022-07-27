import { Controller } from "./Controller";
import { HttpClient } from "../helpers/HttpClient";
import { AluraService } from "../services/AluraService";
import { CourseDAO } from "../dao/CourseDAO";
import { ConnectionFactory } from "../dao/ConnectionFactory";
import { Request, Response } from "express";

export class CourseController extends Controller{
    
    private aluraService : AluraService;
    private courseDao : CourseDAO;

    constructor() {
        super('/course');
        this.router.get('/update-from-api', this.updateFromApi.bind(this));
        this.aluraService = new AluraService(new HttpClient());
        this.courseDao = new CourseDAO(new ConnectionFactory().getInstance());
    }

    async updateFromApi(_request: Request, response: Response){
        try{
            const courses = await this.aluraService.getCourses();
            await this.courseDao.updateAll(courses);
            
            response.send('Courses updated :)');
        } catch(e){
            console.log(e)
            response.send('Courses were not updated :(');
        }
    }
}