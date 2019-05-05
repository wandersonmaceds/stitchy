import { Connection } from "./Connection";
import { User } from "../model/User";

export class UserDAO{
    private connection: Connection;
    
    constructor(connection: Connection){
        this.connection = connection;
    }
    
    async getUsersWithCourses(){
        const query = 'SELECT u.id, u.priority_alert, u.slack_handle, u.name, c.code FROM users u, users_courses uc, courses c WHERE uc.user_id = u.id AND uc.course_id = c.id ORDER BY u.priority_alert, u.id';
        const queryResult = await this.connection.query(query);
        const users = this.transformUsersFromResultQuery(queryResult);
        
        return this.sortByPriorityAlert(users);
    }
    
    async getUsersWithCoursesByScheduling(day: number, scheduledTime: string) {
        console.log('posts schedule: ', day, scheduledTime);
        const query = `select u.id, ua.priority, u.slack_handle, u.name, c.code from users_alerts ua, users u, users_courses uc, courses c where ua.user_id = u.id and uc.course_id = c.id and uc.user_id = u.id and ${day} = any (ua.weekdays) and '${scheduledTime}' = any(ua.hours_of_day) and 'topic' = any(ua.type) ORDER BY ua.priority, u.id`;
        const queryResult = await this.connection.query(query);
        const users = this.transformUsersFromResultQuery(queryResult);
        
        return this.sortByPriorityAlert(users);
    }

    async saveIndicator(user_id: number, indicator: any){
        const query = `INSERT INTO users_indicators (user_id, total_posts, date_posts) values (${user_id}, ${indicator.posts}, '${indicator.date}')`;
        return await this.connection.query(query);
    }
    
    async findByUsernames(usernames: any[]) {
        const queryData = usernames.map(uname => `'${uname}'`).join(',')
        const query = `SELECT * FROM users WHERE alura_handle IN (${queryData})`;
        return await this.connection.query(query);
    }

    private sortByPriorityAlert(users: User[]) : User[] {
        return users.sort((u1, u2) => u1.priority_alert - u2.priority_alert);
    }

    private transformUsersFromResultQuery(queryResult) : User[] {
        const users = {};
        
        queryResult.rows.forEach(row => {
            let user = users[row.slack_handle]
            user = user ? user : new User(row.id, row.name, row.priority, row.slack_handle);    
            
            user.courses.push(row.code);
            users[user.slack_handle] = user;
        });

        return Object.values(users);
    }
}
