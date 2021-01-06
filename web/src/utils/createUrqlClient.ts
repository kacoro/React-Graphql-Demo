import { dedupExchange, fetchExchange, Exchange, stringifyVariables } from 'urql';
import { cacheExchange,Resolver } from '@urql/exchange-graphcache';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import Router from 'next/router';


const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      console.log(error)
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
};

const cursorPagination = (): Resolver => {

  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
   
    const allFields = cache.inspectFields(entityKey);
    console.log("allFields",allFields)
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey,fieldKey) as string,
      "posts")
     info.partial = !isItInTheCache;
     let hasMore = true;
    const results = [];
    fieldInfos.forEach(fi=>{
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key,'posts')as string[];
      const _hasMore = cache.resolve(key,'hasMore')
      if(!_hasMore){
        hasMore = _hasMore as boolean
      }
      console.log("data",data)
      results.push(...data)
    })

    return {
      __typename:"PaginatedPosts",
      hasMore, //true/false
      posts:results
    }
  }
    
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://127.0.0.1:4000/graphql',
  fetchOptions: {
    credentials: "include" as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys:{
        PaginatedPosts:() => null
      },
      resolvers: {
        Query: {
             posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          createPost:(_result, args, cache, info) => {
            console.log("createPost")
            console.log(cache.inspectFields("Query"))
            cache.invalidate("Query","posts",{
                limit:5 //keep the same 
            })
            console.log(cache.inspectFields("Query"))
            console.log("end createPost")
            // betterUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => ({
            //   me: null
            // }))

          },
          logout: (_result, args, cache, info) => {
            console.log("logout")
            // me query
            betterUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => ({
              me: null
            }))

          },
          login: (_result, args, cache, info) => {
            console.log("login")
            // cache.updateQuery({query:MeDocument},(data:MeQuery)=>{})
            betterUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
              if (result.login.errors) {
                return query
              } else {
                return {
                  me: result.login.user
                }
              }
            })
          },
          register: (_result, args, cache, info) => {
            // cache.updateQuery({query:MeDocument},(data:MeQuery)=>{})
            betterUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
              if (result.register.errors) {
                return query
              } else {
                return {
                  me: result.register.user
                }
              }
            })
          }
        }
      }
    }),
    errorExchange,
    fetchExchange,
    ssrExchange
    
  ]


})