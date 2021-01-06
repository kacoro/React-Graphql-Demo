import { Post } from "../entities/Post";
import { Resolver, Query,  Arg, Int, Mutation, InputType, Field, Ctx, UseMiddleware, FieldResolver, Root, ObjectType } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

@InputType()
class PostInput{
    @Field()
    title:string
    @Field()
    text:string
}

@ObjectType()
class PaginatedPosts{
    @Field(() =>[Post])
    posts:Post[]
    @Field()
    hasMore:boolean;
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(()=>String)
    textSnippet(
        @Root() root:Post
    ){
        return root.text.slice(0,50)
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId',() =>Int) postId:number,
        @Arg('value',() =>Int) value:number,
        @Ctx(){req}:MyContext
    ){
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1:-1
        const {userId} = req.session

      
        // await getConnection().query(`
        // START TRANSACTION

        // update post 
        // set points = points + ${realValue}
        // where id = ${postId}

        //INSERT INTO `updoot`(`value`, `userId`, `postId`)

        // COMMIT
        // `)
        await Post.update({id:postId},{points:realValue})
        await Updoot.insert({
            userId,
            postId,
            value:realValue
        })

        // await Post.update({
        //     id
        // })
        return true
    }

    
    @Query(() => PaginatedPosts) // ()=> [Post]
    async posts(
        @Arg('limit',()=>  Int) limit : number,
        @Arg('cursor',()=>  String,{nullable:true}) cursor:string|null
    ): Promise<PaginatedPosts> { //: Promise<Post[]>
        // 20->21
        const realLimit = Math.min(50,limit) ;
        const realLimitPlusOne = realLimit + 1
        // Post.find()
        const qb = getConnection().getRepository(Post).createQueryBuilder("p")
        .innerJoinAndSelect("p.creator","u",'u.id = p.creatorId')
        .orderBy("p.createdAt","DESC").take(realLimitPlusOne)
        if(cursor){
            qb.where("p.createdAt < :cursor",{
                cursor:new Date(parseInt(cursor))
            })
        }
        const posts = await qb.getMany()
        return {posts:posts.slice(0,realLimit),hasMore:posts.length === realLimitPlusOne};
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) id: number,
        ): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx(){req}:MyContext
        ): Promise<Post> {
           
        return await Post.create({ ...input,creatorId:req.session.userId }).save()
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, { nullable: true }) title: string,
       
    ): Promise<Post | null> {
        const post = await Post.findOne(id);
        if (!post) {
            return null;
        } else {
            if (typeof title !== 'undefined') {
                await Post.update({id},{title})
            }
        }
        return post
    }

    @Mutation(() =>Boolean)
    async deletePost(
        @Arg("id") id: number
    ): Promise<boolean> {
        await Post.delete(id)
        return true;
    }
}