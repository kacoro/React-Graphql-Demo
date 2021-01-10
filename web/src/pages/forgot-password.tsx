import React, { useState } from 'react'
import { Formik, Form,  } from 'formik'
import { Box,  Button } from '@chakra-ui/core';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRouter } from 'next/router';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

interface forgotPasswordProps{

}

 const forgotPassword: React.FC<forgotPasswordProps> = ({}) =>{
        const [complete,setComplete] = useState(false);
        const [forgotPassword] = useForgotPasswordMutation()
        const router = useRouter()
        return (
            <Wrapper variant="small">
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await forgotPassword({variables:values});
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
                            color="teal"
                            isLoading={isSubmitting}
                            type="submit"
                        >forgot password</Button>
                    </Form>
                )}
            </Formik></Wrapper>
        );
}

export default withApollo({ ssr: false })(forgotPassword);