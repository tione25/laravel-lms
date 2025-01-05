import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  InputGroup,
  Input,
  Flex,
  Icon,
  Text,
  Box,
  Spinner,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { client } from "../../../utils/client";

const SearchModal = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const {
    isPending,
    isLoading,
    error,
    data: results,
  } = useQuery({
    queryKey: ["CourseSearch", search],
    queryFn: async () => {
      return await client
        .get(`/library?search=${search}`)
        .then((response) => response.data);
    },
    enabled: !!search,
  });

  const searchCourses = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setSearch('')
  }, [open])

  return (
    <>
      <Flex>
        <Box
          display="flex"
          cursor="pointer"
          border="1px"
          w="full"
          alignItems="center"
          px={3}
          py={2}
          borderColor="gray.300"
          rounded="md"
          gap={2}
          onClick={() => setOpen(true)}
        >
          <Icon as={BiSearchAlt} fill="gray.500" />
          <Text color="gray.500">What would you like to learn?</Text>
        </Box>
      </Flex>
      <Modal
        blockScrollOnMount={false}
        isOpen={open}
        size="lg"
        onClose={() => setOpen(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent mx={{base: 4, md: 0}}>
          <ModalBody px={0} py={0}>
            <Box flexDir="column">
              <InputGroup
                borderRadius={5}
                fontSize="sm"
                display="flex"
                alignItems="center"
                px={4}
                my={0}
                py={0}
              >
                <Icon as={BiSearchAlt} fill="teal.600" fontSize={25} />
                <Input
                  type="text"
                  placeholder="Start typing..."
                  border="0"
                  px={4}
                  py={4}
                  outline="0"
                  fontSize="sm"
                  _focusVisible={{ border: "0", outline: "0" }}
                  _active={{ border: "0", outline: "0" }}
                  onChange={(e) => searchCourses(e)}
                />
              </InputGroup>
            </Box>

            {(isLoading) && (
                <Flex w="100%" py={2} alignItems="center" justifyContent="center">
                  <Spinner size="lg" color="gray.200" />
                </Flex>
              )}

            {!isPending && results?.data?.length > 0 && (
              <Flex flexDir="column" maxHeight={"400px"} overflowY="auto" overflowX="hidden">
                {results?.data.map((course, index) => (
                  <Flex
                    as={ChakraLink}
                    key={course.id}
                    cursor="pointer"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={index == results?.data.length - 1 ? 'none' : '1px'}
                    borderColor="gray.100"
                    gap={2}
                    py={4}
                    px={4}
                    _hover={{ bg: "gray.50", textDecor: "none" }}
                    href={`/courses/${course.slug}`}
                  >
                    <Text fontWeight="normal" fontSize="sm">{course.title}</Text>
                  </Flex>
                ))}
              </Flex>
            )}
            {!isPending && results?.data?.length === 0 && (
              <Text textAlign="center" pb={2} fontSize="sm" color={"gray.500"}>No courses found...</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchModal;
