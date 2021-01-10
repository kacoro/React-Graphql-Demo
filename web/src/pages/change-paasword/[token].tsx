import { Box, Button } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import { Formik, Form,  } from 'formik'
import { MeDocument, MeQuery, useChangePasswordMutation } from '../../generated/graphql';
import { withApollo } from '../../utils/withApollo';
interface changePasswordProps {
   
}

 const changePassword:React.FC<changePasswordProps> = () =>{
    const [changePassword] = useChangePasswordMutation()
    const [tokenError,setTokenError] = useState('');
    const router = useRouter()
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newpassword: ""}}
                onSubmit={async (values, { setErrors }) => {
                    console.log(router)
                   
                    const response = await changePassword({
                        variables:{newpassword:values.newpassword,token:router.query.token as string},
                        update: (cache, {data}) => {
                            cache.writeQuery<MeQuery>({
                                query:MeDocument,
                                data:{
                                    __typename:"Query",
                                    me:data?.changePassword.user
                                }
                            })
                            //cache.evict({fieldName:'posts:{}'})
                        }
                    });
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
                            color="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                        >Reset Password</Button>
                    </Form>
                )}
            </Formik></Wrapper>
    );
}

export default withApollo({ ssr: false })(changePassword);