import {
  Box,
  Heading,
  Link,
  Link as LinkChakra,
  ListIcon,
  Text,
} from "@chakra-ui/react";
import { useAdminNavigationStore } from "../../../store/admin/navigation";
import { useLocation } from "react-router-dom";

const NavItem = ({ item, isActive }) => {
  const navigation = useAdminNavigationStore();
  const location = useLocation();
  const { label } = item;

  if (item.type === "link") {
    const { icon } = item;

    return (
      <>
        <Box w="full" display="flex" my={2}>
          <LinkChakra
            href={(item.path == "profile" ? '' : '/admin/') + item.path}
            as={Link}
            gap={3}
            display="flex"
            alignItems="center"
            _hover={{
              textDecoration: "none",
              color: "gray.700",
              bg: "gray.100",
              borderRadius: 10,
              p: 2,
            }}
            fontWeight="medium"
            color={(location.pathname.includes(item.path) && item.path) ? "gray.700" : "gray.500"}
            bg={location.pathname.includes(item.path) && item.path ? "gray.100" : ""}
            w="full"
            justifyContent={navigation.collapse ? "center" : "flex-start"}
            p={2}
            borderRadius={isActive ? 10 : 0}
          >
            <ListIcon as={icon} fontSize={22} m={0} />
            {!navigation.collapse && (
              <Text fontWeight="medium" fontSize={15}>
                {label}
              </Text>
            )}
          </LinkChakra>
        </Box>
      </>
    );
  }

  return (
    <Heading
      color="gray.400"
      fontWeight="medium"
      textTransform="uppercase"
      fontSize="sm"
      borderTopWidth={1}
      borderColor="gray.100"
      pt={6}
      my={4}
    >
      <Text>{label}</Text>
    </Heading>
  );
};

export default NavItem;
