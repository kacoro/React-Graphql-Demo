import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import { Formik, Form,  } from 'formik'
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import {withUrqlClient} from 'next-urql'
interface changePasswordProps {
   
}

 const changePassword:React.FC<changePasswordProps> = () =>{
    const [,changePassword] = useChangePasswordMutation()
    const [tokenError,setTokenError] = useState('');
    const router = useRouter()
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newpassword: ""}}
                onSubmit={async (values, { setErrors }) => {
                    console.log(router)
                   
                    const response = await changePassword({newpassword:values.newpassword,token:router.query.token as string});
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors)
                        if('token' in errorMap){
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)
                    } else if (response.data?.changePassword.user) {
                        router.push("/");
                    }
                }}
            >
                {(props) => (
                    <Form>
                        <InputField name='newpassword' placeholder="new password" label="New password" type="password" />
                        {tokenError?<Box color="red.500">{tokenError}</Box>:null}
                        <Button
                            mt={4}
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                        >Reset Password</Button>
                    </Form>
                )}
            </Formik></Wrapper>
    );
}

// changePassword.getInitialProps = ({query}) =>{
//     return {
//         token:query.token as string
//     }
// }
export default  withUrqlClient(createUrqlClient)(changePassword);