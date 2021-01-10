import "reflect-metadata";
import 'dotenv-safe/config';
import { COOKIE_NAME, __prod__ } from "./constants";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis'
import { MyContext } from "./types";
import cors from 'cors';
import { createConnection } from 'typeorm';
import entitieLoaders from './utils/entitieLoaders';
import typeormConfig from "./typeorm.config";

const main = async () => {
    await createConnection(typeormConfig)
    // const conn = await createConnection(typeormConfig)
    // await conn.runMigrations();
    const app = express();

    const RedisStroe = connectRedis(session)
    const redis = new Redis(process.env.REDIS_URL)
    app.set('trust proxy',1);
    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }))
    
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStroe({ client: redis  as any, disableTouch: true, disableTTL: true }),
            secret: process.env.SESSION_SECRET || 'asdasd',
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 10,
                httpOnly: true,
                sameSite: 'lax',//csrf
                secure: __prod__, //true works in https
                domain:__prod__?'.kacoro.com':undefined
            },
            saveUninitialized: false,
            resave: false,
           
        })
    )

    app.get('/', (_, res) => {
        res.send('hello')
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ req, res, redis,loaders:entitieLoaders })
    })

    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(process.env.PORT, () => {
        console.log('server started on localhost:'+process.env.PORT)
    })
}

main().catch((err) => {
    console.log(err);
})

