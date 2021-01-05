
import { MyContext } from "../types";
import { Resolver, Ctx, Arg, Mutation, Field, ObjectType, Query } from "type-graphql";
import { User } from "../entities/User";
import argon2 from 'argon2'
import { sendEmail } from "../utils/sendEmail";
import { UsernamePasswordInput } from "../types/UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { v4 } from 'uuid'
import { FOGET_PASSWORD_PREFIX } from "../constants";
@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newpassword') newpassword: string,
        @Ctx() { em, redis,req }: MyContext
    ): Promise<UserResponse> {
        if (newpassword.length <= 3) {
            return {
                errors: [{
                    field: "newpassword",
                    message: "length must be greater than 3"
                }]
            }

        }

        const key = FOGET_PASSWORD_PREFIX + token
        const userId = await redis.get(key)
        if (!userId) {
            return {
                errors: [{
                    field: "token",
                    message: "token expired"
                }]
            }
        }
        const user = await em.findOne(User, { id: parseInt(userId) });
        if (!user) {
            return {
                errors: [{
                    field: "token",
                    message: "user no longer exists"
                }]
            }
        }
        user.password =  await argon2.hash(newpassword);
        await em.persistAndFlush(user)
        await redis.del(key)
        req.session.userId = user.id
        return {user}

    }


    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { em, redis }: MyContext
    ) {
        if(!email.includes('@')){
            return false;
       }
        const user = await em.findOne(User, { email });
        if (!user) {
            //the email is not in the db
            return false;
        }
        const token = v4();
        await redis.set(FOGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3) //3 days

        sendEmail(email,
            `<a href="http://localhost:3000/change-paasword/${token}">reset password</a>`
        );
        return true;
    }


    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req, em }: MyContext
    ) {
        if (!req.session.userId) {
            return null
        }
        const user = await em.findOne(User, { id: req.session.userId })
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options)
        if (errors) {
            return { errors }
        }
        const hashedPassword = await argon2.hash(options.password)

        try {
            const user = em.create(User, { username: options.username, email: options.email, password: hashedPassword })
            await em.persistAndFlush(user)
            return { user };
        } catch (error) {
            console.dir(error)
            let message = "error.code:" + error.code
            let field = ""
            if (error.code === 'ER_DUP_ENTRY') {
                // user_email_unique

                let colomn = error.sqlMessage.split(" ")[5].split("_")[1]
                message = colomn + " already exists"
                field = colomn
            }
            return {
                errors: [{
                    field: field,
                    message: message
                }]
            }
        }


    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User,
            usernameOrEmail.includes('@') ?
                { email: usernameOrEmail }
                : { username: usernameOrEmail })
        if (!user) {
            return {
                errors: [{
                    field: "usernameOrEmail",
                    message: "that username or email doesn't exist"
                }]
            }
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "incorrect password"
                }]
            }
        }

        // stoe userId
        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() { req, res }: MyContext
    ) {

        return new Promise(resolve => req.session.destroy((err: any) => {
            res.clearCookie("qid")
            if (err) {
                console.log(err)
                resolve(false)
                return
            }
            resolve(true)

        }))
    }

}