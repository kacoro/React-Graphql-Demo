
import React from 'react'
import NavBar from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';
import {withUrqlClient} from 'next-urql'
import { usePostsQuery } from '../generated/graphql';
interface indexProps{

}

 const index: React.FC<indexProps> = ({}) =>{
    const [{data,fetching}] = usePostsQuery()
    return (
      <>
      <NavBar />
        <div>hello world.</div>  
        {fetching?<div>Loading...</div>:null}
        {!data ?null:data.posts.map(p=><div key={p.id}>{p.title}</div>)}
      </>
    );
}

export default withUrqlClient(createUrqlClient,{ssr:true})(index);
