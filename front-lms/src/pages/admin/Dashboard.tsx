import {
  Icon,
  SimpleGrid,
  Card,
  CardHeader,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineQuiz } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { client } from "../../utils/client";

const Dashboard = () => {
  const { data: stats, isStatsPending } = useQuery({
    queryKey: ["LatestCourses"],
    queryFn: async () => {
      return client.get("/admin/stats").then((response) => response.data);
    },
  });

  return (
    <>
      <SimpleGrid w="full" columns={[1, 1, 3]} gap={6}>
        <Card w="full" variant="outline">
          <CardHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex flexDirection="column">
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Total Students
              </Text>
              <Text fontWeight="bold" fontSize="3xl">
                {stats?.users}
              </Text>
            </Flex>
            <Flex>
              <Icon
                as={PiStudent}
                fontSize={50}
                bg="gray.100"
                p={2}
                rounded="full"
                color="gray.700"
              />
            </Flex>
          </CardHeader>
        </Card>
        <Card w="full" variant="outline">
          <CardHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex flexDirection="column">
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Total Courses
              </Text>
              <Text fontWeight="bold" fontSize="3xl">
              {stats?.courses}
              </Text>
            </Flex>
            <Flex>
              <Icon
                as={CiBookmark}
                fontSize={50}
                bg="gray.100"
                p={2}
                rounded="full"
                color="gray.700"
              />
            </Flex>
          </CardHeader>
        </Card>
        <Card w="full" variant="outline">
          <CardHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex flexDirection="column">
              <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                Total Paths
              </Text>
              <Text fontWeight="bold" fontSize="3xl">
              {stats?.paths}
              </Text>
            </Flex>
            <Flex>
              <Icon
                as={MdOutlineQuiz}
                fontSize={50}
                bg="gray.100"
                p={2}
                rounded="full"
                color="gray.700"
              />
            </Flex>
          </CardHeader>
        </Card>
      </SimpleGrid>
    </>
  );
};

export default Dashboard;
