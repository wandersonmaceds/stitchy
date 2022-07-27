import { Controller } from "./Controller";

export class AppController implements Controller{
    private router : any;
    
    constructor(router: any){
        this.router = router;
        this.router.get('/', this.home.bind(this));
    }

    home(_request, response){
        response.send('App running!');
    }
    
    getRoutes() {
        return this.router;
    }
}