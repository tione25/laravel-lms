import { useQuery } from "@tanstack/react-query";
import { client } from "../../../utils/client";
import { Box, Button, Flex, Grid, Heading } from "@chakra-ui/react";

const Categories = () => {
  const { data: categories, isPending } = useQuery({
    queryKey: ["Categories"],
    queryFn: async () => {
      return client.get("/categories").then((response) => response.data);
    },
  });

  return (
    <>
      {!isPending ? (
        <>
          <Box border="1px" borderColor="teal.300" rounded="xl" p={10} py={14} mt={10}>
            <Heading fontSize={25} color="gray.700" mb={10} textAlign="center">
              Categories
            </Heading>
            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)", xl: "repeat(5, 1fr)" }}
              gap={6}
            >
              {categories?.data?.map((category) => (
                <Box
                  as="a"
                  href={`/library?category=${category.id}`}
                  key={category.id}
                  py={4}
                  border="1px"
                  color="teal.500"
                  borderColor="teal.400"
                  rounded="md"
                  textAlign="center"
                  _hover={{ cursor: "pointer", bg: "teal.50" }}
                >
                  {category.name} ({category.courses_count})
                </Box>
              ))}
            </Grid>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Categories;
