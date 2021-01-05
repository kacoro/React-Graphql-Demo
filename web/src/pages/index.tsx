
import React from 'react'
import NavBar from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';
import {withUrqlClient} from 'next-urql'
import { usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import {  Link } from '@chakra-ui/react';
import NextLink from 'next/link'
interface indexProps{

}

 const index: React.FC<indexProps> = ({}) =>{
    const [{data,fetching}] = usePostsQuery()
    return (
      <Layout>
      <NextLink href="/create-post">
        <Link   mt={2}>create post</Link>
        </NextLink>

        {!data?(
        <div>Loading...</div>
        ):(
          data.posts.map(p=><div key={p.id}>{p.title}</div>)
         )}
      </Layout>
    );
}

export default withUrqlClient(createUrqlClient,{ssr:true})(index);
