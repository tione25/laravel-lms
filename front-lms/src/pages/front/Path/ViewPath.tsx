import { Navigate, useParams } from "react-router-dom";
import SimpleHero from "../../../components/Front/ui/SimpleHero";
import { getUser } from "../../../services/useGetUser";
import { useQuery } from "@tanstack/react-query";
import { client } from "../../../utils/client";
import { Text, Flex, Spinner } from "@chakra-ui/react";
import PathCoursesList from "./PathCoursesList";

import { Helmet } from 'react-helmet';

const ViewPath = () => {
  const { slug } = useParams();

  const { data: user, isPending: userPending } = getUser();

  const { data: path, isPending, isError } = useQuery({
    queryKey: ["Path", slug],
    queryFn: async () => {
      return client.get(`/paths/${slug}`).then((response) => response.data);
    },
    retry: 0,
  });

  if (isError) {
    return <Navigate to="/" />;
  }

  return (
    <>
          <Helmet>
        <title>{(path?.title ?? '') + ' | CourseCasts'}</title>
      </Helmet>


      {isPending ? (
        <Flex w="100%" alignItems="center" justifyContent="center">
          <Spinner size="lg" color="gray.200" />
        </Flex>
      ) : (
        <>
          <SimpleHero title={path.title} description={path.description} />
          {path?.courses?.length >= 0 && (
            <>
              <PathCoursesList path={path} />
            </>
          )}

          {path?.courses?.length === 0 && (
            <Text textAlign="center">No courses at this moment.</Text>
          )}
        </>
      )}
    </>
  );
};

export default ViewPath;
