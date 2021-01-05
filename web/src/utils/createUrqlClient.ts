import { dedupExchange, fetchExchange, Exchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import Router from 'next/router';


const errorExchange: Exchange = ({ forward }) => (ops$) => {
  console.log('err')
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


export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include" as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
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