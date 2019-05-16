import { Topic } from "../dto/Topic";

export class TopicFilters{
    
    static filterByCourseCode(topics: Topic[], courseCode: string){
        return topics.filter(topic => topic.courseCode == courseCode)
    }

    static filterByLimiter(topics: Topic[], limiter: number){
        return topics.slice(0, limiter);
    }

    static filterByCoursesCodesAndLimiter(topics: Topic[], coursesCodes: any[], limiter: number){
        const topicsFiltered = [];
        coursesCodes.forEach(courseCode => topicsFiltered.push(...this.filterByCourseCode(topics, courseCode)));
        return this.filterByLimiter(topicsFiltered, limiter);
    }

}