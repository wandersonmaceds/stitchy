import { Connection } from "./Connection";
import { Course } from "../dto/Course";

export class CourseDAO{
    
    private connection : Connection;
    
    constructor(connection: Connection){
        this.connection = connection;
    }
    
    updateAll(courses: Course[]) {
        //todo: get courses from the API, compare with the local, active and desactive locally. 
    }

}