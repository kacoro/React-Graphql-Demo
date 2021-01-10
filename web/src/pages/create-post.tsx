import { Box, Flex, Button, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import router from 'next/dist/next-server/lib/router/router';
import React, { useEffect } from 'react'
import InputField from '../components/InputField';
import { useRouter } from 'next/router'
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql'
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';


const createPost: React.FC<{}> = ({ }) => {
    const router = useRouter()
    useIsAuth()
    const [ createPost] = useCreatePostMutation()
    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const { errors } = await createPost({
                        variables:{ input: values} ,
                        update:(cache) =>{
                            cache.evict({fieldName:'posts:{}'})
                        }
                    });
                    
                    if (!errors) {
                        router.push("/");
                    }
                }}
            >
                {(props) => (
                    <Form>
                        <InputField name='title' placeholder="title" label="title" />
                        <Box mt={4}>
                            <InputField textare name='text' placeholder="text..." label="text" type="text" />
                        </Box>
                        <Flex mt={4}>
                            <Button
                                colorScheme="teal"
                                isLoading={props.isSubmitting}
                                type="submit"
                            >Create Post</Button>

                        </Flex>

                    </Form>
                )}
            </Formik></Layout>
    );
}

export default withApollo({ ssr: false })(createPost);