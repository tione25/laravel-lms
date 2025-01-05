import { useQuery } from "@tanstack/react-query";
import { client } from "../../../utils/client";
import { Flex, Heading, SimpleGrid, Spinner, Link as ChakraLink } from "@chakra-ui/react";
import PathCard from "../PathCard";

const LatestPaths = () => {
  type Path = {
    id: number;
    title: string;
    preview_image: string;
  };
  const { data: latestPaths, isPending } = useQuery({
    queryKey: ["LatestPaths"],
    queryFn: async () => {
      return client.get("/latest-paths").then((response) => response.data);
    },
  });

  return (
    <>
      <Flex flexDir="column" w="full">
        {isPending && (
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Spinner size="lg" color="gray.200" />
          </Flex>
        )}
        {!isPending && latestPaths?.data?.length != 0 && (
          <>
            <Flex justifyContent="space-between" alignItems="center"  mb={12}>
              <Heading fontWeight={"medium"}>
                Latest Paths
              </Heading>
              <ChakraLink href="/paths">
                View All
              </ChakraLink>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} spacing={8}>
              {latestPaths?.map((path) => (
                <PathCard key={path.id} path={path} />
              ))}
            </SimpleGrid>
          </>
        )}
      </Flex>
    </>
  );
};

export default LatestPaths;
