import React, { useState } from 'react'
import { createUrqlClient } from '../utils/createUrqlClient';
import {withUrqlClient} from 'next-urql'
import { Formik, Form,  } from 'formik'
import { Box, Flex, Button, Link } from '@chakra-ui/react';
import router from 'next/dist/next-server/server/router';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { toErrorMap } from '../utils/toErrorMap';
import login from './login';
import { useRouter } from 'next/router';
import { useForgotPasswordMutation } from '../generated/graphql';

interface forgotPasswordProps{

}

 const forgotPassword: React.FC<forgotPasswordProps> = ({}) =>{
        const [complete,setComplete] = useState(false);
        const [, forgotPassword] = useForgotPasswordMutation()
        const router = useRouter()
        return (
            <Wrapper variant="small">
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await forgotPassword(values);
                    if(response.data.forgotPassword){
                        setComplete(true)
                    }else{
                        setErrors({email:'invalid email'})
                    }
                    
                }}
            >
                {({isSubmitting}) => complete ? <Box>if an account with that email exists. web sent you can email</Box> : (
                    <Form>
                        <InputField name='email' placeholder="email" label="email" />
                        
                        <Button mt="4"
                            colorScheme="teal"
                            isLoading={isSubmitting}
                            type="submit"
                        >forgot password</Button>
                    </Form>
                )}
            </Formik></Wrapper>
        );
}

export default withUrqlClient(createUrqlClient)(forgotPassword)