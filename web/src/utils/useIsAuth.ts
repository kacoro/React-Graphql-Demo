import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () =>{
    const {data,loading} = useMeQuery();
    const router = useRouter()
    console.log(router)
    useEffect(() => {
        if(!loading&&!data?.me){
            const path = router.asPath?router.asPath:router.pathname
            router.push(  '/login?next='+path)
        }
    }, [loading,data,router])
}