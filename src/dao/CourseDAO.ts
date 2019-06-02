import { Connection } from "./Connection";
import { Course } from "../dto/Course";

export class CourseDAO{
    
    private connection : Connection;
    
    constructor(connection: Connection){
        this.connection = connection;
    }
    
    async updateAll(courses: Course[]) {
        const ids = await this.connection.query('SELECT id FROM courses');
        const nonLocalCourse = courses.filter(c => !ids.rows.find(row => c.id == row.id));
        if(nonLocalCourse.length != 0){
            const queryData = nonLocalCourse.map(course => `(${course.id}, '${course.code}')`).join(',');
            const query = `INSERT INTO courses (id, code) VALUES ${queryData}`;
            await this.connection.query(query)
        }
    }

}