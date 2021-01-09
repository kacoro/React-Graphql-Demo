import { createUserLoader } from "./createUserLoader";
import { createUpdootLoader } from "./createUpdootLoader";


const entitieLoaders = {
    UpdootLoader:createUpdootLoader(),
    UserLoader:createUserLoader()
}
export default entitieLoaders