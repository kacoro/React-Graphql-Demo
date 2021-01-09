import {  ConnectionOptions } from "typeorm";
import { __prod__ } from "./constants";

// import { Post } from "./entities/Post";
//  import { User } from "./entities/User";
import path from 'path'
// import { Updoot } from "./entities/Updoot";
export default {
    type: 'mysql',
    // database: 'multilangsite',
    // username: 'multisite',
    // password: '123456',
    url:process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    // entities:[Post, User,Updoot],
    entities: [ path.join(__dirname,'./entities/**{.ts,.js}') ],
    migrations:[path.join(__dirname,"./migrations/*")],
    
} as  ConnectionOptions ;