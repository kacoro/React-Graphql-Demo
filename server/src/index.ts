import "reflect-metadata";
import {MikroORM} from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis'
import { MyContext } from "./types";
import cors from 'cors'


const main = async () =>{
    
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    const app = express();

    const RedisStroe = connectRedis(session)
    const redis = new Redis()
    app.use(cors({
        origin:"http://localhost:3000",
        credentials:true
    }))
    app.use(
        session({
            name:COOKIE_NAME,
            store:new RedisStroe({client:redis,disableTouch:true,disableTTL:true}),
            secret:'dasdaaweqeqwedazd21',
            cookie:{
                maxAge:1000*60*60*24*10,
                httpOnly:true,
                sameSite:'lax',//csrf
                secure:__prod__ //true works in https
            },
            saveUninitialized:false,
            resave:false,
        })
    )

    app.get('/',(_,res) =>{
        res.send('hello')
    })

    const apolloServer = new ApolloServer({
        schema:await buildSchema({
            resolvers:[HelloResolver,PostResolver,UserResolver],
            validate:false
        }),
        context:({req,res}):MyContext =>({em:orm.em,req,res,redis})
    })

    apolloServer.applyMiddleware({
        app,
        cors:false
    });

    app.listen(4000,()=>{
        console.log('server started on localhost:4000')
    })
}

main().catch((err) =>{
    console.log(err);
})

