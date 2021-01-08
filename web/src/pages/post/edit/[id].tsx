import { useRouter } from 'next/router';
import React from 'react'
import Layout from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql'
import { Box, Heading ,Flex,Button} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import InputField from '../../../components/InputField';
import { useIsAuth } from '../../../utils/useIsAuth';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { useGetIntId } from '../../../utils/useGetIntId';
interface editPostProps {

}

const EditPost: React.FC<editPostProps> = ({ }) => {
    useIsAuth()
    const router = useRouter()
    const intId = useGetIntId()
    
    
    const [{ data,error, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId
        }
    })
    const [,updatePost] = useUpdatePostMutation()
    if(fetching){
        <Layout>
        <div>loading...</div>
         </Layout>
    }
    if(error){
        return  <Layout>
        <div>{error.message}</div>
         </Layout>
    }
    if(!data?.post){
        return <Layout>
            <Box>could not find post</Box>
        </Layout>
    }
    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: data.post.title, text:  data.post.text }}
                onSubmit={async (values, { setErrors }) => {
                    const { error } =  await updatePost({id:intId,...values})
                     console.log(error)
                    if (!error) {
                        router.back()
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
                            >Update Post</Button>

                        </Flex>

                    </Form>
                )}
            </Formik></Layout>
    );
}
export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);