import { Box, Flex, IconButton } from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation, VoteMutation } from '../generated/graphql';
import gql from 'graphql-tag';
import { ApolloCache } from '@apollo/client/cache';
interface UpdootSectionProps {
    post: PostSnippetFragment
}

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<VoteMutation>) => {
    const data = cache.readFragment<{
        id: number;
        points: number;
        voteStatus: number | null
    }>({
        id: "Post:" + postId,
        fragment: gql`fragment _ on Post{
            id
            points
            voteStatus
        }`
    })
    if (data) {
        if (data.voteStatus === value) {
            return
        }
        const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
        cache.writeFragment({
            id: "Post:" + postId,
            fragment: gql`
                fragment __ on Post{
                    points
                    voteStatus
                }
          `,
           data: { id: postId, points: newPoints, voteStatus: value }
        }
        )
    }

}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
    const [vote] = useVoteMutation()
    return (
        <Flex direction="column" justifyContent="content" alignItems="center" pr={5}>
            <IconButton icon={<ChevronUpIcon />} aria-label="updoot post"
                isLoading={loadingState === 'updoot-loading'}
                colorScheme={post.voteStatus === 1 ? "green" : undefined}
                onClick={async () => {
                    if (post.voteStatus === 1) {
                        return;
                    }
                    setLoadingState('updoot-loading')
                    await vote({
                        variables: {
                            postId: post.id,
                            value: 1
                        }, update: (cache) => updateAfterVote(1, post.id, cache)
                    })
                    setLoadingState('not-loading')
                }} />
            <Box>{post.points}</Box>
            <IconButton icon={<ChevronDownIcon />} aria-label="updoot post"
                colorScheme={post.voteStatus === -1 ? "red" : undefined}
                isLoading={loadingState === 'downdoot-loading'}
                onClick={async () => {
                    if (post.voteStatus === -1) {
                        return;
                    }
                    setLoadingState('downdoot-loading')
                    await vote(
                        {
                            variables: { postId: post.id, value: -1 },
                            update: (cache) => updateAfterVote(-1 , post.id, cache)
                        })
                    setLoadingState('not-loading')
                }} />
        </Flex>
    );
}
export default UpdootSection;