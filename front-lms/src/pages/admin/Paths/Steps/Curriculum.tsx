import { Box, Heading } from "@chakra-ui/react";
import Builder from "../Builder";

interface CurriculumProps {
  path: any;
}

const Curriculum = ({ path }: CurriculumProps) => {
  return (
    <>
      <Heading fontSize="lg" mb={4}>
        Curriculum
      </Heading>

      <Box>
        <Builder path={path}/>
      </Box>
    </>
  );
};

export default Curriculum;
