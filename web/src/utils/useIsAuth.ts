import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () =>{
    const [{data,fetching}] = useMeQuery();
    const router = useRouter()
    console.log(router)
    useEffect(() => {
        if(!fetching&&!data?.me){
            const path = router.asPath?router.asPath:router.pathname
            router.push(  '/login?next='+path)
        }
    }, [fetching,data,router])
}