import { Post } from "../entities/Post";
import { Resolver, Query, Arg, Int, Mutation, InputType, Field, Ctx, UseMiddleware, FieldResolver, Root, ObjectType } from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[]
    @Field()
    hasMore: boolean;
}



@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(
        @Root() root: Post
    ) {
        return root.text.slice(0, 50)
    }
    @FieldResolver(() => Int, { nullable: true })
    voteStatus(
        @Root() root: Post
    ) {
        console.log(root.updoots)
        // root.updoots
        if (root.updoots) {
            return root.updoots[0]?.value
        } else {
            return null
        }

    }

    @Mutation(() => Int)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() { req }: MyContext
    ) {

        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1
        const { userId } = req.session

        const updoot = await Updoot.findOne({ postId, userId })
        console.log("updoot:", updoot)
        // the user has voted on the post before
        // and they are changing their vote
        if (updoot && updoot.value !== realValue) {
            await Post.update({ id: postId }, { points: () => `points +${2 * realValue}` })
            await Updoot.update({
                userId,
                postId
            }, { value: realValue })
        } else if (!updoot) {

            await Post.update({ id: postId }, { points: () => `points +${realValue}` })
            await Updoot.insert({
                userId,
                postId,
                value: realValue
            })
        } else {
            return 0
        }

        return realValue
    }


    @Query(() => PaginatedPosts) // ()=> [Post]
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
        @Ctx() { req }: MyContext
    ): Promise<PaginatedPosts> { //: Promise<Post[]>
        // 20->21
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1

        const replacements: any[] = [realLimitPlusOne, req.session.userId]

        if (cursor) {
            const parseCurrsor = new Date(parseInt(cursor))
            replacements.push(parseCurrsor)
        }


        const qb = getConnection().getRepository(Post).createQueryBuilder("p")
            .innerJoinAndSelect("p.creator", "u", 'u.id = p.creatorId')
            .orderBy("p.createdAt", "DESC").take(realLimitPlusOne)
        if (req.session.userId) {
            qb.leftJoinAndSelect("p.updoots", "up", 'up.postId = p.id and userId =' + req.session.userId)
        }

        if (cursor) {
            qb.where("p.createdAt < :cursor", {
                cursor: new Date(parseInt(cursor))
            })
        }
        const posts = await qb.getMany()

        return { posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne };
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) id: number,
    ): Promise<Post | undefined> {
        return Post.findOne(id, { relations: ["creator"] });
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post> {

        return await Post.create({ ...input, creatorId: req.session.userId }).save()
    }

    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("id", () => Int) id: number,
        @Arg("title") title: string,
        @Arg("text") text: string,
        @Ctx() { req }: MyContext
    ): Promise<Post | null> {

        const result = await Post.update({
            id,
            creatorId: req.session.userId
        }, { title, text })
        if (result.affected) {
            const post = await Post.findOne(id)
            if (post) {
                return post
            }
        }

        return null;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        //not casecade way
        // const post = await Post.findOne(id)
        // if(!post){
        //     return false
        // }
        // if(post.creatorId !== req.session.userId){
        //     throw new Error("not authorized")
        // }
        // await Updoot.delete({postId:id})
        // await Post.delete({id,creatorId:req.session.userId})
        // return true;

        await Post.delete({ id, creatorId: req.session.userId })
        return true;
    }
}