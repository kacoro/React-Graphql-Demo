
import React from 'react'
import {  usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import UpdootSection from '../components/UpdootSection'
import { Box, Button, Flex, Heading,  Link, Stack, Text } from '@chakra-ui/core';
import NextLink from 'next/link'
import EditDeletePostButtons from '../components/EditDeletePostButtons';
import { withApollo } from '../utils/withApollo';

interface indexProps {

}

const index: React.FC<indexProps> = ({ }) => {
  const { data,error, loading,fetchMore,variables } = usePostsQuery({
    variables:{
      limit:5,
      cursor:null
    },
    notifyOnNetworkStatusChange:true
  })
  
  if (!loading && !data) {
    return <div><div>you got query failed for some reason</div>
    <div>{error?.message}</div></div>
  }

  return (
    <Layout> 
      {!data && loading ? (
        <div>Loading...</div>
      ) : (
          <Stack spacing={8}>

            {data.posts.posts.map(p =>
              !p?null:
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link> <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                  </NextLink>
                <Text mt={4}>{p.creator.username}</Text>
                <Flex>
                    <Text flex={1} mt={4}>{p.textSnippet}</Text>
                    <EditDeletePostButtons creatorId={p.creator.id} id={p.id}/>
                </Flex>
                
                </Box>
              </Flex>
            )}
          </Stack>
        )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button onClick={() => {
            fetchMore({
              variables:{
                limit: variables!.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
              },
              // updateQuery:(previousValue,{fetchMoreResult}:{fetchMoreResult:PostsQuery}):PostsQuery=>{
              //   if(!fetchMoreResult){
              //     return previousValue as PostsQuery
              //   }
              //   return {
              //     __typename:'Query',
              //     posts:{
              //       __typename:"PaginatedPosts",
              //       hasMore:(fetchMoreResult as PostsQuery).posts.hasMore,
              //       posts:[
              //         ...(previousValue as PostsQuery).posts.posts,
              //         ...(fetchMoreResult as PostsQuery).posts.posts
              //       ]
              //     }
              //   }
              // }
            })
           
          }} isLoading={loading} m="auto" my={8}>load more</Button>
         
        </Flex>
      ) : null}
    </Layout>
  );
}


export default withApollo({ ssr: true })(index);