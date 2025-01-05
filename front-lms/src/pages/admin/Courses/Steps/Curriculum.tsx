import {  Heading } from "@chakra-ui/react";
import Builder from "../Builder";


interface CurriculumProps {
  course?: any;
}

const Curriculum = ({ course }: CurriculumProps) => {
 

  return (
    <>
      <Heading fontSize="lg" mb={4}>
        Curriculum
      </Heading>


      <Builder course={course} />
    </>
  );
};

export default Curriculum;
