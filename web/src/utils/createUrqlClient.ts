import { dedupExchange, fetchExchange, Exchange, stringifyVariables } from 'urql';
import { cacheExchange,Resolver } from '@urql/exchange-graphcache';
import { DeletePostMutationVariables, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import Router from 'next/router';
import gql from 'graphql-tag';
import { isServer } from './isServer';


const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
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
    // console.log("allFields",allFields)
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
      results.push(...data)
    })

    return {
      __typename:"PaginatedPosts",
      hasMore, //true/false
      posts:results
    }
  }
    
};

export const createUrqlClient = (ssrExchange: any,ctx:any) => {

  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }
 
  return {
  url: 'http://127.0.0.1:4000/graphql',
  fetchOptions: {
    credentials: "include" as const,
    headers: cookie
    ? {
        cookie,
      }
    : undefined,
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
          deletePost:(_result, args, cache, info)=>{
            cache.invalidate({
              __typename:"Post",
              id:(args as DeletePostMutationVariables).id,
            })
          },
          vote:(_result, args, cache, info)=>{
             const {postId,value} = args as VoteMutationVariables
             const data = cache.readFragment(
              gql`fragment _ on Post{
                id
                points
                voteStatus
              }`,
              {id:postId} as any
             )
             if(data){
               if(data.voteStatus === value){
                 return
               }
               const newPoints = (data.points as number) +(!data.voteStatus? 1 : 2)*value;
               cache.writeFragment(
                 gql`
                  fragment __ on Post{
                    points
                    voteStatus
                  }
                 `,
                 {id:postId,points:newPoints,voteStatus:value} 
               )
             }
             
          },
          createPost:(_result, args, cache, info) => {
            // console.log("createPost")
            // console.log(cache.inspectFields("Query"))
         
            const allFields = cache.inspectFields("Query");
            const fieldInfo = allFields.filter((info) =>info.fieldName ==='posts')
            fieldInfo.forEach((fi)=>{
              cache.invalidate("Query","posts",fi.arguments)
            })
            // console.log(cache.inspectFields("Query"))
            // console.log("end createPost")
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

  }
}