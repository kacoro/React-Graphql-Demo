import { Box, Button, Flex, Heading, IconButton, Link, Stack, Text } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useDeletePostMutation, useMeQuery, usePostsQuery } from '../generated/graphql';
interface EditDeletePostButtonsProps {
    id: number;
    creatorId:number
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id ,creatorId}) => {
    const [, deletePost] = useDeletePostMutation()
    const [{data:meData}] = useMeQuery();

    if(meData?.me?.id !==creatorId) {
        return null
    }
    return (
        <Box>
            <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                <IconButton as={Link} colorScheme="green" mr="4" ml="auto" icon={<EditIcon />} aria-label="Delete post"
                >
                </IconButton>
            </NextLink>

            <IconButton colorScheme="red" ml="auto" icon={<DeleteIcon />} aria-label="Delete post"
                onClick={() => {
                    deletePost({ id: id })
                }} >

            </IconButton>
        </Box>
    );
}
export default EditDeletePostButtons;