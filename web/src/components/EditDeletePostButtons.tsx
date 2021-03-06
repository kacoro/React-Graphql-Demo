import { Box, IconButton, Link } from '@chakra-ui/core';
import React from 'react'
import NextLink from 'next/link'
import { useDeletePostMutation, useMeQuery, usePostsQuery } from '../generated/graphql';
interface EditDeletePostButtonsProps {
    id: number;
    creatorId:number
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id ,creatorId}) => {
    const [deletePost]= useDeletePostMutation()
    const {data:meData} = useMeQuery();

    if(meData?.me?.id !==creatorId) {
        return null
    }
    return (
        <Box>
            <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                <IconButton as={Link} color="green" mr="4" ml="auto" icon="edit" aria-label="Delete post"
                >
                </IconButton>
            </NextLink>

            <IconButton color="red" ml="auto" icon="delete" aria-label="Delete post"
                onClick={() => {
                    deletePost({ variables: {id},
                        update:(cache)=>{
                        cache.evict({id:'Post:' +id})
                     }
                  })
                }} >

            </IconButton>
        </Box>
    );
}
export default EditDeletePostButtons;