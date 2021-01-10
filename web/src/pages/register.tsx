import { Box, Button } from '@chakra-ui/core';
import React from 'react'
import { Formik, Form, } from 'formik'
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';

import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router'
import { withApollo } from '../utils/withApollo';
interface registerProps {

}

const register: React.FC<registerProps> = ({ }) => {
    const [register] = useRegisterMutation()
    const router = useRouter()

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email: "", username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(router)

                    const response = await register({
                        variables: { options: values },
                        update: (cache, {data}) => {
                            cache.writeQuery<MeQuery>({
                                query:MeDocument,
                                data:{
                                    __typename:"Query",
                                    me:data?.register.user
                                }
                            })
                        }
                    });
                    console.log(response)
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors))
                    } else if (response.data?.register.user) {
                        console.log(response)
                        router.push("/");
                    }
                    // setTimeout(() => {
                    //   alert(JSON.stringify(values, null, 2))
                    //actions.setSubmitting(false)
                    // }, 1000)
                }}
            >
                {(props) => (
                    <Form>
                        <InputField name='username' placeholder="username" label="Username" />
                        <Box mt={4}>
                            <InputField name='email' placeholder="email" label="Email" />
                        </Box>
                        <Box mt={4}>
                            <InputField name='password' placeholder="password" label="Password" type="password" />
                        </Box>
                        <Button
                            mt={4}
                            color="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                        >Register</Button>
                    </Form>
                )}
            </Formik></Wrapper>
    );
}
export default withApollo({ ssr: false })(register);