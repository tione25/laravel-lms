import {
    AccordionItem,
    AccordionButton,
    Flex,
    IconButton,
    Box,
    Text,
    Badge,
  } from "@chakra-ui/react";
  import { useSortable } from "@dnd-kit/sortable";
  import { MdDragIndicator } from "react-icons/md";
  import { CSS } from "@dnd-kit/utilities";
  import DeleteCourse from "../../Partials/DeleteCourse";
  
  interface CourseItemProps {
    course: any;
    section: any;
    path: any;
    sectionIndex: number;
    courseSelected: any;
    setCourseSelected: (value: any) => void;
  }
  
  const CourseItem = ({
    path,
    course,
    section,
    sectionIndex,
    courseSelected,
    setCourseSelected,
  }: CourseItemProps) => {
    const {
      setNodeRef,
      attributes,
      listeners,
      transform,
      transition,
      setActivatorNodeRef,
      isDragging,
    } = useSortable({
      id: course.id,
      data: {
        type: "Course",
        course,
      },
    });
  
    const style = {
      transition,
      transform: CSS.Translate.toString(transform),
    };
  
    return (
      <>
        <AccordionItem
          ref={setNodeRef}
          style={style}
          key={course.id}
          borderTop={
            section.courses.length === 1 || sectionIndex === 0 ? "none" : ""
          }
          borderBottom="none"
        >
          <AccordionButton
            as="div"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box as="span" flex="1" textAlign="left">
              <Flex align="center">
                <IconButton
                  icon={<MdDragIndicator />}
                  aria-label=""
                  colorScheme="unstyled"
                  color="gray.600"
                  fontSize={18}
                  cursor="pointer"
                  px={0}
                  ref={setActivatorNodeRef}
                  {...attributes}
                  {...listeners}
                />
                <Text>{course.title} <Badge colorScheme={course.status === 'public' ? 'green' : 'gray'}>{course.status}</Badge></Text>
              </Flex>
            </Box>
            <Flex alignItems="center">
            <DeleteCourse course={course} section={section}/>
            </Flex>
          </AccordionButton>
        </AccordionItem>
      </>
    );
  };
  
  export default CourseItem;