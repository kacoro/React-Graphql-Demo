import { Box, Flex ,IconButton} from '@chakra-ui/react'
import { ChevronUpIcon,ChevronDownIcon} from '@chakra-ui/icons'
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps{
    post: PostSnippetFragment
}

 const UpdootSection: React.FC<UpdootSectionProps> = ({post}) =>{
       const [loadingState, setLoadingState] = useState<'updoot-loading'|'downdoot-loading'|'not-loading'>('not-loading')
        const [,vote] = useVoteMutation()
        return (
            <Flex direction="column" justifyContent="content" alignItems="center" pr={5}>
                <IconButton icon={<ChevronUpIcon />} aria-label="updoot post" 
                isLoading={loadingState==='updoot-loading'}
                colorScheme={post.voteStatus===1 ? "green" : undefined}
                onClick={async()=>{
                    if(post.voteStatus === 1){
                        return;
                    }
                    setLoadingState('updoot-loading')
                    await vote({
                        postId:post.id,
                        value:1
                    })
                    setLoadingState('not-loading')
                }}  />
                <Box>{post.points}</Box>
                <IconButton icon={<ChevronDownIcon />} aria-label="updoot post" 
                colorScheme={post.voteStatus===-1 ?"red":undefined}
                isLoading={loadingState==='downdoot-loading'} 
                onClick={async()=>{
                    if(post.voteStatus === -1){
                        return;
                    }
                    setLoadingState('downdoot-loading')
                    await vote({
                        postId:post.id,
                        value:-1
                    })
                    setLoadingState('not-loading')
                }}  />
            </Flex>
        );
}
export default UpdootSection;