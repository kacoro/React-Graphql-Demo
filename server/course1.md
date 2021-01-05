一.简易教程
1.安装依赖
```
npm init
yarn add -D @types/node typescript ts-node nodemon
npx tsconfig.json
```

2.设置package script
```
"watch": "tsc -w",
    "dev": "nodemon dist/index.js",
    "start": "node dist/index.js",
    "start2": "ts-node src/index.ts",
    "dev2": "nodemon --exec ts-node src/index.ts"
```

3.添加 /src/indexe.ts 
```
console.log("hello there.")
```

>使用
yarn dev2


二. 安装数据库依赖
yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg



定义实体
```
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {

  @PrimaryKey()
  id!: number;

  @Property({type:'date'})
  createdAt = new Date();

  @Property({ type:'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  title!: string;
}
```

创建表格
npx mikro-orm migration:create

```
const orm = await MikroORM.init(microConfig);
await orm.getMigrator().up();
const post = orm.em.create(Post,{title:'my first post'});
await orm.em.persistAndFlush(post);
//await orm.em.nativeInsert(Post,{title:'my first post 2'})
const posts = await orm.em.find(Post,{});
console.log(posts);

```

三、创建接口
```
yarn add express apollo-server-express graphql type-graphql
yarm add -D @types/express 
```


resolvers/hello.ts
```
import { Resolver,Query } from "type-graphql";

@Resolver()
export class HelloResolver{
    @Query(() => String)
    hello(){
        return "bye"
    }
}
```

创建服务器
```
  const app = express();
    app.get('/',(_,res) =>{
        res.send('hello')
    })

    const apolloServer = new ApolloServer({
        schema:await buildSchema({
            resolvers:[HelloResolver],
            validate:false
        })
    })

    apolloServer.applyMiddleware({app});

    app.listen(4000,()=>{
        console.log('server started on localhost:4000')
    })
```


yarn add reflect-metadata
> graphql 必须在入口文件引入 reflect-metadata ，否则会报错
```
 Unable to infer GraphQL type from 
TypeScript reflection system. You need to provide expli
cit type for 'createdAt' of 'Post' class.
```

一个用户实体
```
@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(()=> String)
  @Property({type:'date'})
  createdAt = new Date();

  @Field(()=> String)
  @Property({ type:'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({type:"text",unique:true})
  username!: string;

  @Property({type:"text"})
  password!: string;
}
```


1、通过script创建数据表格
```


使用 yarn create:migration 根据实体修改数据库
package.json
"script":{
    ...
    "create:migration":"mikro-orm migration:create"
    ...
}
```

使用 argon2 加密密码
使用redis 存储用户信息

```
yarn add  redis connect-redis express-session
yarn add -D @types/redis @types/express-session  @types/connect-redis
```

graphql调试时设置，支持cookies
  "request.credentials": "include",
 

nodemailer邮箱发放
```
yarn add nodemailer yarn add uuid ioredis
yarn add -D @types/nodemailer
yarn add @types/uuid @types/ioredis
```

