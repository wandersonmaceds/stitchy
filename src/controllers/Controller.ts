import { Router } from 'express';

export abstract class Controller {
    protected readonly router: Router;
    private readonly basePath: string;

    constructor(basePath: string) {
        this.router = Router();
        this.basePath = basePath;
    }
    
    getBasePath(): string {
        return this.basePath;
    }

    getRouter(): Router {
        return this.router;
    }
}