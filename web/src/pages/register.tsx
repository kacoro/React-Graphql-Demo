import { Box, Button } from '@chakra-ui/react';
import React from 'react'
import { Formik, Form,  } from 'formik'
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';

import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router'
import { createUrqlClient } from '../utils/createUrqlClient';
import {withUrqlClient} from 'next-urql'
interface registerProps {

}

const register: React.FC<registerProps> = ({ }) => {
    const [, register] = useRegisterMutation()
    const router = useRouter()

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email:"", username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(router)
                   
                    const response = await register({options:values});
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
                            <InputField name='email' placeholder="email" label="Email"  />
                        </Box>
                        <Box mt={4}>
                            <InputField name='password' placeholder="password" label="Password" type="password" />
                        </Box>
                        <Button
                            mt={4}
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                        >Register</Button>
                    </Form>
                )}
            </Formik></Wrapper>
    );
}
export default withUrqlClient(createUrqlClient,{ssr:true})(register);