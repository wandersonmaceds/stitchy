import { Connection } from "./Connection";
import { User } from "../model/User";
import { Course } from "../dto/Course";

export class UserCourseDAO{
    private connection: Connection;
    
    constructor(connection: Connection){
        this.connection = connection;
    }
    
    private deleteCoursesFromUser(userId: number){
        const query = `DELETE FROM users_courses WHERE user_id = ${userId}`;
        this.connection.query(query);   
    }
    
    private addCoursesToUser(userIds: number[], courses: Course[]){
        const query = `INSERT INTO users_courses (user_id, course_id)`;
        this.connection.query(query);   
    }
    
    async deleteCoursesFromUsers(users: User[]){
        users.forEach(u => this.deleteCoursesFromUser(u.id));
    }
    
    async addCoursesToUsers(usersCoursesFromProfiles: User[]) {
        usersCoursesFromProfiles.forEach(async user => {
            const queryIds = `SELECT id from courses WHERE code IN (${user.courses.join(',')})`;
            const coursesIds = await this.connection.query(queryIds);
            
            const userIdCourseIdQueryData = coursesIds.rows.map(c => `(${user.id}, ${c.id})`).join(',');
            const queryUserCoursesIds = `INSERT INTO users_courses(user_id, course_id) VALUES ${userIdCourseIdQueryData}`;
            await this.connection.query(queryUserCoursesIds);
        });
    }
    
}