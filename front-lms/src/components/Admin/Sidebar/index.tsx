import { Box } from "@chakra-ui/react";
import Logo from "./Logo";
import Navigation from "./Navigation";

export const Sidebar = () => {
    return (<>
        <Box w="full">
            <Logo/>
            <Navigation/>
        </Box>
    </>)
}
 
export default Sidebar;