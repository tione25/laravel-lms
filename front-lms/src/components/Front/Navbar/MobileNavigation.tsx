import {
  Button,
  Icon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Flex,
  Divider,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdMenuOpen } from "react-icons/md";
import SearchModal from "./SearchModal";

interface MobileNavigationProps {
  user?: Object;
  onLogout: () => void;
}

const MobileNavigation = ({ user, onLogout }: MobileNavigationProps) => {
  const [mobileNavigation, setMobileNavigation] = useState(false);
  return (
    <>
      {/* Mobile Sidebar Version */}
      <Box display={{ base: "flex", lg: "none" }}>
        <Button
          as="div"
          onClick={() => setMobileNavigation(true)}
          bg="transparent"
        >
          <Icon as={MdMenuOpen} fontSize={30}></Icon>
        </Button>
        <Drawer
          isOpen={mobileNavigation}
          placement="left"
          onClose={() => setMobileNavigation(!mobileNavigation)}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
              <Flex flexDir="column" gap={2} mt={10} alignItems="center">
                <Box
                  w={{ base: "flex", md: 400 }}
                  display={{ base: "flex", md: "flex" }}
                  justifyContent="center"
                  my={2}
                >
                  <SearchModal />
                </Box>
                {user && user.is_admin === 1 && (
                  <ChakraLink
                    w="full"
                    textAlign="center"
                    py={1}
                    _hover={{ textDecor: "none", bg: "red.100" }}
                    bg="red.100"
                    href="/admin"
                    rounded="sm"
                  >
                    Admin Area
                  </ChakraLink>
                )}
                <ChakraLink
                  href="/"
                  w="full"
                  textAlign="center"
                  py={1}
                  _hover={{ textDecor: "none", bg: "teal.100" }}
                  rounded="sm"
                >
                  Home
                </ChakraLink>
                <ChakraLink
                  href="/library"
                  w="full"
                  textAlign="center"
                  py={1}
                  _hover={{ textDecor: "none", bg: "teal.100" }}
                  rounded="sm"
                >
                  Library
                </ChakraLink>
                <ChakraLink
                  href="/paths"
                  w="full"
                  textAlign="center"
                  py={1}
                  _hover={{ textDecor: "none", bg: "teal.100" }}
                  rounded="sm"
                >
                  Path
                </ChakraLink>
                <ChakraLink
                  href="/contact"
                  w="full"
                  textAlign="center"
                  py={1}
                  _hover={{ textDecor: "none", bg: "teal.100" }}
                  rounded="sm"
                >
                  Contact
                </ChakraLink>

                <Divider my={2}/>

                {!user ? (
                  <>
                    <ChakraLink
                      href="/login"
                      w="full"
                      textAlign="center"
                      py={1}
                      _hover={{ textDecor: "none", bg: "teal.100" }}
                      rounded="sm"
                    >
                      Sign In
                    </ChakraLink>
                    <ChakraLink
                      href="/signup"
                      w="full"
                      textAlign="center"
                      py={1}
                      _hover={{ textDecor: "none", bg: "teal.100" }}
                      rounded="sm"
                    >
                      Sign Up
                    </ChakraLink>
                  </>
                ) : (
                  <>
                    <ChakraLink
                      href="/profile"
                      w="full"
                      textAlign="center"
                      py={1}
                      _hover={{ textDecor: "none", bg: "teal.100" }}
                      rounded="sm"
                    >
                      Profile
                    </ChakraLink>
                    <ChakraLink
                      href="/my-courses"
                      w="full"
                      textAlign="center"
                      py={1}
                      _hover={{ textDecor: "none", bg: "teal.100" }}
                      rounded="sm"
                    >
                      My Courses
                    </ChakraLink>
                    <ChakraLink
                      as="button"
                      w="full"
                      textAlign="center"
                      py={1}
                      _hover={{ textDecor: "none", bg: "teal.100" }}
                      rounded="sm"
                      onClick={onLogout}
                    >
                      Logout
                    </ChakraLink>
                  </>
                )}
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};

export default MobileNavigation;
