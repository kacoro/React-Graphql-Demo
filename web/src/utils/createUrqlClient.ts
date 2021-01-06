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
    const isItInTheCache = cache.resolve(entityKey,fieldKey)
     info.partial = !isItInTheCache;
    const results = [];
    fieldInfos.forEach(fi=>{
      const data = cache.resolve(entityKey, fi.fieldKey) as string []
      console.log("data",data)
      results.push(...data)
    })
    return results
  }
    
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include" as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            // me query
            betterUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => ({
              me: null
            }))

          },
          login: (_result, args, cache, info) => {
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