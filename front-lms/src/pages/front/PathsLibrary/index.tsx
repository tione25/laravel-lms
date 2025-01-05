import { Box, Button, Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { client } from "../../../utils/client";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import CourseCard from "../../../components/Front/CourseCard";

import { Select } from "chakra-react-select";
import SimpleHero from "../../../components/Front/ui/SimpleHero";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PathCard from "../../../components/Front/PathCard";

import { Helmet } from 'react-helmet';

interface CategoryInterface {
  label: string;
  value: number;
  variant: string;
}

const PathsLibrary = () => {
  type Path = {
    id: number;
    title: string;
    preview_image: string;
  };

  const queryClient = useQueryClient();
  const [categoriesList, setCategoriesList] = useState<CategoryInterface[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ["Paths"],
    queryFn: async ({ pageParam }) => {
      const res = await client.get(
        `paths?category=${searchParams.get("category") ?? ""}&&order=${
          searchParams.get("order") ?? ""
        }&&cursor=${pageParam}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  const { data: categories, isPending: isCategoriesPending } = useQuery({
    queryKey: ["Categories"],
    queryFn: async () => {
      return client.get("/categories").then((response) => response.data);
    },
  });

  const filterCourses = (item, type) => {
    const { label, value } = item;

    setSearchParams((searchParams) => {
      // Add the new query param value to the queryString
      searchParams.set(type, value);
      return searchParams;
    });

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      refetch();
    }, 500);
  };

  const clearFilters = () => {
    searchParams.delete("category");
    searchParams.delete("order");
    searchParams.delete("cursor");
    setSearchParams(searchParams);
    queryClient.resetQueries({ queryKey: ["Paths"] });
  };

  return (
    <>
      <Helmet>
        <title>Paths | CourseCasts</title>
      </Helmet>

      <Flex flexDir="column">
        {/* Simple Page Hero */}
        <SimpleHero title="Paths Library" />

        {/* Filters */}
        <Flex
          flexDirection={{ base: "column", lg: "row" }}
          mb={14}
          gap={4}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box fontSize="md" display="flex" gap={2} color="gray.400">
            We found{" "}
            <Text color="gray.600">
              {data?.pages.flatMap((page) => page.data)?.length ?? 0} paths
            </Text>{" "}
            available for you
          </Box>
          <Flex
            w={{ base: "full", md: "auto" }}
            gap={4}
            flexDir={{ base: "column", md: "row" }}
            alignItems="center"
          >
            {(searchParams.get("category") != "" ||
              searchParams.get("order") != "") && (
              <Button onClick={clearFilters}>Clear</Button>
            )}
            <Box w={{ base: "full", md: 300 }}>
              <Select
                tagVariant={"solid"}
                placeholder="All Categories"
                size="lg"
                options={categories?.data?.map((category) => ({
                  label: category.name,
                  value: category.id,
                  variant: "outline", // The option variant overrides the global
                }))}
                value={categories?.data
                  ?.map((category) => ({
                    label: category.name,
                    value: category.id,
                    variant: "outline", // The option variant overrides the global
                  }))
                  .filter(
                    (option) => option.value == searchParams.get("category")
                  )}
                onChange={(e) => filterCourses(e, "category")}
              />
            </Box>
            <Box w={{ base: "full", md: 200 }}>
              <Select
                tagVariant={"solid"}
                placeholder="Sort By"
                size="lg"
                options={[
                  {
                    label: "Latest",
                    value: "desc",
                    variant: "outline", // The option variant overrides the global
                  },
                  {
                    label: "Oldest",
                    value: "asc",
                    variant: "outline", // The option variant overrides the global
                  },
                ]}
                value={[
                  {
                    label: "Latest",
                    value: "asc",
                    variant: "outline", // The option variant overrides the global
                  },
                  {
                    label: "Oldest",
                    value: "desc",
                    variant: "outline", // The option variant overrides the global
                  },
                ].filter((option) => option.value == searchParams.get("order"))}
                onChange={(e) => filterCourses(e, "order")}
              />
            </Box>
          </Flex>
        </Flex>

        {status === "pending" ||
        (isFetching && !isFetchingNextPage) ||
        loading ? (
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Spinner size="lg" color="gray.200" />
          </Flex>
        ) : (
          <>
            {data.pages.map((group, i) => (
              <Box key={i}>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                  spacing={8}
                  mb={10}
                >
                  {group.data.map((path) => (
                    <PathCard path={path} key={path.id} />
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </>
        )}
      </Flex>
      {isFetchingNextPage ? (
        <Flex w="100%" alignItems="center" justifyContent="center">
          <Spinner size="lg" color="gray.200" />
        </Flex>
      ) : hasNextPage ? (
        <Flex alignItems="center" justifyContent="center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            Load More
          </Button>
        </Flex>
      ) : (
        ""
      )}
    </>
  );
};

export default PathsLibrary;
