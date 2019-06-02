import { Controller } from "./Controller";
import { IndicatorService } from "../services/IndicatorService";
import { HttpClient } from "../helpers/HttpClient";
import { UserDAO } from "../dao/UserDAO";
import { Connection } from "../dao/Connection";
import { ConnectionFactory } from "../dao/ConnectionFactory";
import * as moment from "moment-timezone";

export class IndicatorController implements Controller{
    private router;
    private indicatorService: IndicatorService;
    private userDao: UserDAO;

    constructor(router){
        this.router = router;
        this.router.get('/update/all', this.updateFromAPI.bind(this));
        this.router.get('/update/lastday', this.updateFromAPILastDay.bind(this));
        this.indicatorService = new IndicatorService(new HttpClient());
        this.userDao = new UserDAO(new ConnectionFactory().getInstance());
    }

    async updateFromAPI(request, response){
        const usersIndicators = await this.indicatorService.getAll();
        const usernames = usersIndicators.map((u: any) => u.username);
        const users = await this.userDao.findByUsernames(usernames);
        users.rows.forEach(user => {
            const ui : any = usersIndicators.find((ui: any) => ui.username == user.alura_handle);
            console.log(ui);
            ui.indicators.forEach(i => this.userDao.saveIndicator(user.id, i) );
        });
        
        response.send('atualizando indicadores');
    }

    async updateFromAPILastDay(request, response){
        
        const lastDay = moment().tz('America/Sao_Paulo').subtract(1, 'days').format('YYYY-MM-DD');
        const usersAllIndicators = await this.indicatorService.getAll();
        const usersIndicators = usersAllIndicators.map((u: any) => {
            const lastDayIndicators = u.indicators.filter(i => i.date == lastDay)
            u.indicators = lastDayIndicators;

            return u;
        });

        const usernames = usersIndicators.map((u: any) => u.username);
        const users = await this.userDao.findByUsernames(usernames);
        
        users.rows.forEach(user => {
           const ui : any = usersIndicators.find((ui: any) => ui.username == user.alura_handle);
            ui.indicators.forEach(i => this.userDao.saveIndicator(user.id, i) );
        });
        
        response.send('atualizando indicadores');
    }

    getRoutes() {
        return this.router;
    }
}