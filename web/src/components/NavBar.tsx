import {Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {
    const router = useRouter()
    const { data, loading } = useMeQuery({
        skip:isServer()
    });
    const [logout,{loading:logoutFetching}] = useLogoutMutation();
    const ApolloClient  = useApolloClient()
    let body = null

    if (loading) {//data is loading

    } else if (!data?.me) { //user not logged in
        body = (
            <div>
                
                <NextLink href="/login"><Link color='white' mr={2}>Login</Link></NextLink>
                <NextLink href="/register"><Link color='white'>Register</Link></NextLink>
            </div>
        )
    } else { // user is logged in
        body = (
            <Flex align="center">
                <NextLink href="/create-post">
                <Button ml="auto" mr={4}>create post</Button>
                </NextLink>
                <Box mr={2}>{data.me.username}</Box>
                <Button variant="link" isLoading={logoutFetching} onClick={async ()=>{
                    await logout();
                    ApolloClient.resetStore()
                    // router.reload()
                }}>logout</Button>
            </Flex>
        )
    }


    return (
        <Flex zIndex={1} position="sticky" top="0" bg='tomato' p={4} ml={'auto'} align='center'>
            <Flex flex={1} m="auto" align="center" maxW={800}>
            <NextLink href="/"><Link>
                <Heading>Kacoro</Heading>
            </Link></NextLink>
            <Box ml={'auto'}>
                {body}
            </Box>
            </Flex>
        </Flex>
    );
}
export default NavBar;