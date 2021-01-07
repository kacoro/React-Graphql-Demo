
import React, { useState } from 'react'
import NavBar from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql'
import { usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import UpdootSection from '../components/UpdootSection'
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link'
interface indexProps {

}

const index: React.FC<indexProps> = ({ }) => {
  const [variables, setVariables] = useState({ limit: 5, cursor: null })
  const [{ data, fetching }] = usePostsQuery({
    variables
  })

  if (!fetching && !data) {
    return <div>you got query failed for some reason</div>
  }

  return (
    <Layout>
      <Flex>
        <NextLink href="/create-post">
          <Button ml="auto" mt={2}>create post</Button>
        </NextLink>
      </Flex>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
          <Stack spacing={8}>

            {data.posts.posts.map(p =>
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box>
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.creator.username}</Text>
                <Text mt={4}>{p.textSnippet}</Text>
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
