import { Post } from "../entities/Post";
import { Resolver, Query,  Arg, Int, Mutation, InputType, Field, Ctx, UseMiddleware, FieldResolver, Root } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput{
    @Field()
    title:string
    @Field()
    text:string
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(()=>String)
    textSnippet(
        @Root() root:Post
    ){
        return root.text.slice(0,50)
    }
    
    @Query(() => [Post])
    async posts(
        @Arg('limit',()=>  Int) limit : number,
        @Arg('cursor',()=>  String,{nullable:true}) cursor:string|null
    ): Promise<Post[]> {
        const realLimit = Math.min(50,limit);
        // Post.find()
        const qb = getConnection().getRepository(Post).createQueryBuilder("p").orderBy("createdAt","DESC").take(realLimit)
        if(cursor){
            qb.where("`createdAt` < :cursor",{
                cursor:new Date(parseInt(cursor))
            })
        }
        return (
            qb.getMany()
        );
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) id: number,
        ): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async creactePost(
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