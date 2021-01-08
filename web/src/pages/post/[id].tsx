import { useRouter } from 'next/router';
import React from 'react'
import Layout from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql'
import { Box, Heading } from '@chakra-ui/react';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
interface postProps {

}

const Post: React.FC<postProps> = ({ }) => {
    const router = useRouter()
    const [{ data,error, fetching }] = useGetPostFromUrl()
    if(fetching){
        <Layout>
        <div>loading...</div>
         </Layout>
    }
    if(error){
        return  <Layout>
        <div>{error.message}</div>
         </Layout>
    }
    if(!data?.post){
        return <Layout>
            <Box>could not find post</Box>
        </Layout>
    }
    return (
        <Layout>
            <Heading  fontSize="xl">{data.post.title}</Heading>
            {data?.post?.text}
        </Layout>
    );
}
export default withUrqlClient(createUrqlClient, { ssr: true })(Post);