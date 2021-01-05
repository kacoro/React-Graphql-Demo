import { createClient, Provider,dedupExchange,fetchExchange} from 'urql';
import {cacheExchange,Cache,QueryInput} from '@urql/exchange-graphcache'
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange:any) =>({
    url: 'http://localhost:4000/graphql',
    exchanges:[dedupExchange,cacheExchange({
      updates:{
        Mutation:{
          logout:(_result,args,cache,info) =>{
            // me query
            betterUpdateQuery<LogoutMutation,MeQuery>(cache,{query:MeDocument},_result,(result,query)=>({
             
                  me: null
            }))
              
          },
          login:(_result,args,cache,info) =>{
            // cache.updateQuery({query:MeDocument},(data:MeQuery)=>{})
            betterUpdateQuery<LoginMutation,MeQuery>(cache,{query:MeDocument},_result,(result,query)=>{
              if(result.login.errors){
                return query
              }else{
                return{
                  me: result.login.user
                }
              }
            })
          },
          register:(_result,args,cache,info) =>{
            // cache.updateQuery({query:MeDocument},(data:MeQuery)=>{})
            betterUpdateQuery<RegisterMutation,MeQuery>(cache,{query:MeDocument},_result,(result,query)=>{
              if(result.register.errors){
                return query
              }else{
                return{
                  me: result.register.user
                }
              }
            })
          }
        }
      }
    }),fetchExchange],
    fetchOptions:{
        credentials:"include" as const
    },
    //  () => {
    //   // const token = getToken();
    //   return {
    //     credentials:"include"
    //   //   // headers: { authorization: token ? `Bearer ${token}` : '' },
    //   };
    // },
    ssrExchange
})