
import React,{useState} from 'react'
import NavBar from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql'
import { usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import { Box, Button, Flex, Heading, Link, Stack,Text } from '@chakra-ui/react';
import NextLink from 'next/link'
interface indexProps {

}

const index: React.FC<indexProps> = ({ }) => {
  const [variables,setVariables] = useState({limit:5,cursor:null})
  const [{ data,fetching }] = usePostsQuery({
    variables
  })

  if(!fetching && !data){
    return <div>you got query failed for some reason</div>
  }

  return (
    <Layout>
      <Flex>
      <NextLink href="/create-post">
        <Button ml="auto" mt={2}>create post</Button>
      </NextLink>
      </Flex>
      {!data&&fetching ? (
        <div>Loading...</div>
      ) : (
          <Stack spacing={8}>
            {data.posts.map(p =>
              <Box key={p.id} p={5} shadow="md" borderWidth="1px">
             
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet}</Text>
                </Box>
            )}
          </Stack>
        )}
        <Flex>
        <Button onClick={()=>{
          setVariables({
            limit:variables.limit,
            cursor:data.posts[data.posts.length-1].createdAt
          })
        }} isLoading={fetching} m="auto" my={8}>load more</Button>
        </Flex>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(index);
