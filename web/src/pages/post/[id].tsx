import { useRouter } from 'next/router';
import React from 'react'
import Layout from '../../components/Layout';
import { Box, Heading } from '@chakra-ui/react';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import { withApollo } from '../../utils/withApollo';
interface postProps {

}

const Post: React.FC<postProps> = ({ }) => {
    const router = useRouter()
    const { data,error,loading } = useGetPostFromUrl()
    if(loading){
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
            <Box my={4}>
            {data?.post?.text}
            </Box>
            
            <EditDeletePostButtons creatorId={data.post.creator.id} id={data.post.id}/>
        </Layout>
    );
}

export default withApollo({ ssr: true })(Post);