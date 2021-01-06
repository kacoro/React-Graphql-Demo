import {  ConnectionOptions } from "typeorm";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
 import { User } from "./entities/User";
import path from 'path'

export default {
    type: 'mysql',
    database: 'multilangsite',
    username: 'multisite',
    password: '123456',
    logging: true,
    synchronize: true,
    entities:[Post, User],
    migrations:[path.join(__dirname,"./migrations/*")],
    
} as  ConnectionOptions ;