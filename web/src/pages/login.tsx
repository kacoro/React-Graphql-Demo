import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import { Formik, Form,  } from 'formik'
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import NextLink from 'next/link'
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router'
import { createUrqlClient } from '../utils/createUrqlClient';
import {withUrqlClient} from 'next-urql'
import { withApollo } from '../utils/withApollo';
interface registerProps {

}

const login: React.FC<registerProps> = ({ }) => {
    const [login] = useLoginMutation()
    const router = useRouter()

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(router)
                   
                    const response = await login({variables: values,
                        update: (cache, {data}) => {
                            cache.writeQuery<MeQuery>({
                                query:MeDocument,
                                data:{
                                    __typename:"Query",
                                    me:data?.login.user
                                }
                            })
                            cache.evict({fieldName:'posts:{}'})
                        }});
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors))
                    } else if (response.data?.login.user) {
                        console.log(response)
                        if(typeof router.query.next === 'string'){
                            router.push(router.query.next);
                        }else{
                            router.push( "/");
                        }
                      
                    }
                    // setTimeout(() => {
                    //   alert(JSON.stringify(values, null, 2))
                    //actions.setSubmitting(false)
                    // }, 1000)
                }}
            >
                {(props) => (
                    <Form>
                        <InputField name='usernameOrEmail' placeholder="username or email" label="username" />
                        <Box mt={4}>
                            <InputField name='password' placeholder="password" label="Password" type="password" />
                        </Box>
                        <Flex mt={4}>
                        <Button
                            
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                        >Login</Button>
                         <NextLink href="/forgot-password"><Link  ml={2} mt={2}>forgot password</Link></NextLink>
                        </Flex>
                        
                    </Form>
                )}
            </Formik></Wrapper>
    );
}
export default withApollo({ ssr: false })(login);