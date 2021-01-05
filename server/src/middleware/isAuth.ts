import { User } from '../entities/User'
import { MyContext } from '../types'
import { MiddlewareFn } from 'type-graphql'

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    if (!context.req.session.userId) {
        console.log('not authenticated', context.req.session.userId)
        throw new Error('not authenticated')
    }
    const user = await User.findOne({ id: context.req.session.userId });
    if (!user) {
        throw new Error('not authenticated')
    }
    return next();
}