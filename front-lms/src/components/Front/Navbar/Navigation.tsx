import {
  Flex,
  Divider,
  Button,
  Link as ChakraLink,
  Show,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
} from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";
import { getUser } from "../../../services/useGetUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../../api/user";
import { useEffect, useState } from "react";
import MobileNavigation from "./MobileNavigation";

const Navigation = () => {
  const { data: user, isPending } = getUser();
  const [image, setImage] = useState(
    "https://sealms-api.levelcoding.com/storage/" + user?.profile_image
  );

  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationKey: ["User"],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries();
      localStorage.removeItem("authToken");
      window.location.href = "/";
    },
    onError: (error) => {
      console.log("signOutMutation error: ", error);
    },
  });

  const onLogout = () => {
    logoutMutation();
  };

  useEffect(() => {
    setImage(
      "https://sealms-api.levelcoding.com/storage/" + user?.profile_image
    );
  }, [isPending, user, image, setImage]);

  return (
    <>
      <Flex
        display={{ base: "none", lg: "flex" }}
        flexDirection="row"
        gap={4}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        zIndex={1000}
      >
        <ChakraLink href="/library" _hover={{ textDecor: "none" }}>
          Library
        </ChakraLink>
        <ChakraLink href="/paths" _hover={{ textDecor: "none" }}>
          Path
        </ChakraLink>
        <ChakraLink href="/contact" _hover={{ textDecor: "none" }}>
          Contact
        </ChakraLink>
        <Divider
          orientation="vertical"
          size="50"
          h={8}
          colorScheme="messenger"
        />
        <Flex gap={4}>
          {!user && (
            <Show above="sm">
              <Button
                as={ChakraLink}
                w="full"
                display="flex"
                size="sm"
                rounded="md"
                color="gray.700"
                bg="teal.100"
                _hover={{
                  bg: ["gray.300"],
                  textDecor: "none",
                }}
                href="/login"
              >
                Sign In
              </Button>
              <Button
                as={ChakraLink}
                w="full"
                display="flex"
                size="sm"
                rounded="md"
                color="white"
                bg="teal.500"
                _hover={{
                  bg: ["blue.400"],
                  textDecor: "none",
                }}
                href={"/signup"}
              >
                Join Us
              </Button>
            </Show>
          )}

          {user && !isPending && (
            <Menu>
              <MenuButton>
                <Avatar src={image} objectFit="cover" />
              </MenuButton>
              <MenuList zIndex={9999} position="relative">
                {user && user.is_admin === 1 && (
                  <MenuItem>
                    <ChakraLink
                      display="flex"
                      w="full"
                      _hover={{ textDecor: "none" }}
                      href="/admin"
                    >
                      Admin Area
                    </ChakraLink>
                  </MenuItem>
                )}
                <MenuItem>
                  <ChakraLink
                    display="flex"
                    w="full"
                    _hover={{ textDecor: "none" }}
                    href="/"
                  >
                    Home
                  </ChakraLink>
                </MenuItem>
                <MenuItem>
                  <ChakraLink
                    display="flex"
                    w="full"
                    _hover={{ textDecor: "none" }}
                    href="/profile"
                  >
                    Profile
                  </ChakraLink>
                </MenuItem>
                <MenuItem>
                  <ChakraLink
                    display="flex"
                    w="full"
                    _hover={{ textDecor: "none" }}
                    href="/my-courses"
                  >
                    My Courses
                  </ChakraLink>
                </MenuItem>
                <MenuItem
                  display="flex"
                  w="full"
                  _hover={{ textDecor: "none" }}
                  onClick={onLogout}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {!user && (
            <Show below="sm">
              <Button
                as={ChakraLink}
                variant="unstyled"
                bg="gray.100"
                rounded="full"
                display="flex"
                href="/login"
              >
                <Icon as={FaRegUser} fontSize={25} color="gray.700"></Icon>
              </Button>
            </Show>
          )}
        </Flex>
      </Flex>

      <MobileNavigation user={user} onLogout={onLogout}/>
    </>
  );
};

export default Navigation;
