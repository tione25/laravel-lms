import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Link as ChakraLink,
  Avatar,
  Text,
} from "@chakra-ui/react";

import Sidebar from "../Sidebar";

import { useAdminNavigationStore } from "../../../store/admin/navigation";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";
import { getUser } from "../../../services/useGetUser";
import { useEffect, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { logout } from "../../../api/user";

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  const navigation = useAdminNavigationStore();
  const { data: user, isPending, isError } = getUser();
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
    setImage("https://sealms-api.levelcoding.com/storage/" + user?.profile_image);
  }, [isPending]);

  if (!user) {
    return ""
  }

  return (
    <>
      {!isPending && (
        <HStack
          h="100vh"
          minH="100vh"
          w="full"
          position="relative"
          bg="white"
          p={5}
          py={0}
          overflowX="hidden"
        >
          <Flex
            as="aside"
            display={{ base: "none", md: "flex" }}
            w={navigation.collapse ? 90 : 300}
            minH="100%"
            bg="white"
            position="fixed"
            p={5}
            pl={0}
            borderRightWidth="1px"
            borderColor="gray.200"
            transition="ease-in-out .2s"
          >
            <Sidebar />
          </Flex>

          {/* Mobile Sidebar Version */}
          <Box display={{ base: "flex", md: "none" }}>
            <Drawer
              isOpen={navigation.mobileSidebar}
              placement="left"
              onClose={() =>
                navigation.toggleMobileSidebar(!navigation.mobileSidebar)
              }
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody>
                  <Sidebar />
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Box>

          <Flex
            as="main"
            flexDirection="column"
            gap={10}
            w="full"
            h="90%"
            ml={{ base: 0, md: navigation.collapse ? 120 : 350 }}
            transition="ease-in-out .2s"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Button
                display={{ base: "none", md: "flex" }}
                onClick={() => navigation.toggleCollapse(!navigation.collapse)}
              >
                <Icon as={MdMenuOpen} fontSize={30}></Icon>
              </Button>
              <Button
                display={{ base: "flex", md: "none" }}
                onClick={() =>
                  navigation.toggleMobileSidebar(!navigation.mobileSidebar)
                }
              >
                <Icon as={MdMenuOpen} fontSize={30}></Icon>
              </Button>
              {user && (
                <Menu>
                  <MenuButton>
                    <Avatar src={image ?? ""} objectFit="cover" />
                  </MenuButton>
                  <MenuList zIndex={9999} position="relative">
                    {user && user.is_admin === 1 && (
                      <MenuItem>
                        <ChakraLink
                          display="flex"
                          w="full"
                          _hover={{ textDecor: "none" }}
                          href="/"
                        >
                          Front
                        </ChakraLink>
                      </MenuItem>
                    )}
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
            </Flex>
            <Outlet />
          </Flex>
        </HStack>
      )}
    </>
  );
};

export default Layout;
