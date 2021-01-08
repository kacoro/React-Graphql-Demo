import {Request,Response} from 'express'
import {Redis} from 'ioredis';
import { createUpdootLoader } from './utils/createUpdootLoader';
import { createUserLoader } from './utils/createUserLoader';
export type MyContext = {
   
    req: Request & { session: {
        userId?:number
    } }
    res: Response,
    redis:Redis;
    loaders: {
        UserLoader:ReturnType<typeof createUserLoader>
        UpdootLoader:ReturnType<typeof createUpdootLoader>
    }
}