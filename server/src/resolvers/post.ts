import { Post } from "../entities/Post";
import { Resolver, Query,  Arg, Int, Mutation, InputType, Field, Ctx, UseMiddleware } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";

@InputType()
class PostInput{
    @Field()
    title:string
    @Field()
    text:string
}

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(): Promise<Post[]> {
        return Post.find();
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