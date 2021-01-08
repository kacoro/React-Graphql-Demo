
import React, { useState } from 'react'
import NavBar from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql'
import { useDeletePostMutation, useMeQuery, usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import UpdootSection from '../components/UpdootSection'
import { Box, Button, Flex, Heading, IconButton, Link, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
interface indexProps {

}

const index: React.FC<indexProps> = ({ }) => {
  const [variables, setVariables] = useState({ limit: 5, cursor: null })
  const [{ data, fetching }] = usePostsQuery({
    variables
  })

  const [{data:meData}] = useMeQuery();

  const [,deletePost] = useDeletePostMutation()

  if (!fetching && !data) {
    return <div>you got query failed for some reason</div>
  }

  return (
    <Layout>
      {!data && fetching ? (
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
                    {meData?.me.id !== p.creator.id ?null:<Box>

                    <NextLink href="/post/edit/[id]" as={`/post/edit/${p.id}`}>
                    <IconButton as={Link} colorScheme="green" mr="4" ml="auto" icon={<EditIcon />} aria-label="Delete post" 
                     >
                    </IconButton>
                    </NextLink>
                    
                    <IconButton colorScheme="red"  ml="auto" icon={<DeleteIcon />} aria-label="Delete post" 
                    onClick={()=>{
                      deletePost({id:p.id})
                    }} >

                    </IconButton>
                    </Box>}
                </Flex>
                
                </Box>
              </Flex>
            )}
          </Stack>
        )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button onClick={() => {
            setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
            })
          }} isLoading={fetching} m="auto" my={8}>load more</Button>
        </Flex>
      ) : null}
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(index);
