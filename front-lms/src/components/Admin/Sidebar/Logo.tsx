import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { SiPhpmyadmin } from "react-icons/si";
import { useAdminNavigationStore } from "../../../store/admin/navigation";

const Logo = () => {
  const navigation = useAdminNavigationStore()
  
  return (
    <Flex w="full" alignItems="center" justifyContent="center" gap={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Icon as={SiPhpmyadmin} fontSize={40} />
        {!navigation.collapse && (
          <Text fontWeight="bold" fontSize={20}>
            Dashboard
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default Logo;
