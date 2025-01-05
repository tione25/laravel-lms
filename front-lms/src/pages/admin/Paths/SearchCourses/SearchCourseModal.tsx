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
  Divider,
  Button,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { client } from "../../../../utils/client";
import { storePathCourse } from "../../../../api/admin/path";
import { useParams } from "react-router-dom";

interface SearchCourseModalProps {
  section: any;
}

const SearchCourseModal = ({ section }: SearchCourseModalProps) => {
  const queryClient = useQueryClient();
  const { id } = useParams();


  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { mutateAsync } = useMutation({
    mutationKey: ["PathCourseSearchResults"],
    mutationFn: storePathCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Path", id] });
      queryClient.invalidateQueries({ queryKey: ["PathCourseSearchResults"] });
    },
  });

  const {
    isPending,
    isLoading,
    error,
    data: results,
  } = useQuery({
    queryKey: ["PathCourseSearchResults", search],
    queryFn: async () => {
      return await client
        .get(`/admin/paths/sections/${section?.id}/search-courses?search=${search}`)
        .then((response) => response.data);
    },
    enabled: !!search,
  });

  const searchCourses = (e) => {
    setSearch(e.target.value);
  };

  const addCourseToPath = async (course) => {
    try {
      await mutateAsync({ section, course });
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <>
      <Flex justifyContent="flex-end">
        <Button onClick={() => setOpen(true)}>Add Course</Button>
      </Flex>
      <Modal
        blockScrollOnMount={false}
        isOpen={open}
        size="xl"
        onClose={() => setOpen(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex py={2} flexDir="column">
              <InputGroup
                borderRadius={5}
                size="sm"
                display="flex"
                alignItems="center"
              >
                <Icon as={BiSearchAlt} fill="teal.600" fontSize={25} />
                <Input
                  type="text"
                  placeholder="Search courses.."
                  border="0"
                  px={4}
                  py={5}
                  outline="0"
                  fontSize="lg"
                  _focusVisible={{ border: "0", outline: "0" }}
                  _active={{ border: "0", outline: "0" }}
                  onChange={(e) => searchCourses(e)}
                />
              </InputGroup>
              {results && <Divider my={2} />}
            </Flex>

            {isLoading && <p>Loading...</p>}

            {!isLoading && results && (
              <Flex flexDir="column" gap={4} pb={6}>
                {results?.map((course) => (
                  <Flex
                    key={course.id}
                    cursor="pointer"
                    rounded="md"
                    justifyContent="space-between"
                    alignItems="center"
                    border="1px"
                    borderColor="gray.100"
                    px={3}
                    py={2}
                    bg="gray.100"
                    gap={2}
                    _hover={{ bg: "gray.200" }}
                    onClick={() => addCourseToPath(course)}
                  >
                    <Text fontWeight="medium">{course.title}</Text>
                  </Flex>
                ))}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchCourseModal;
