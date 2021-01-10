import { useRouter } from 'next/router';
import React from 'react'
import Layout from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { Box, Flex,Button} from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import InputField from '../../../components/InputField';
import { useIsAuth } from '../../../utils/useIsAuth';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';
interface editPostProps {

}

const EditPost: React.FC<editPostProps> = ({ }) => {
    useIsAuth()
    const router = useRouter()
    const intId = useGetIntId()
    
    
    const { data,error, loading } = usePostQuery({
        skip: intId === -1,
        variables: {
            id: intId
        }
    })
    const [updatePost] = useUpdatePostMutation()
    if(loading){
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
                    const { errors } =  await updatePost({variables:{id:intId,...values}})
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
                            <InputField textarea name='text' placeholder="text..." label="text" type="text" />
                        </Box>
                        <Flex mt={4}>
                            <Button
                                color="teal"
                                isLoading={props.isSubmitting}
                                type="submit"
                            >Update Post</Button>

                        </Flex>

                    </Form>
                )}
            </Formik></Layout>
    );
}

export default withApollo({ ssr: false })(EditPost);