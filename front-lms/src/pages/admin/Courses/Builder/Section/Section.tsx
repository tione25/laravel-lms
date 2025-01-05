import {
  AccordionItem,
  AccordionButton,
  Flex,
  IconButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import EditSection from "./EditSection";
import DeleteSection from "./DeleteSection";
import Lessons from "../Lessons";

interface SectionProps {
  course: any;
  section: any;
  sectionIndex: number;
  sectionSelected: any;
  setSectionSelected: (value: any) => void;
}

const Section = ({
  course,
  section,
  sectionIndex,
  sectionSelected,
  setSectionSelected,
}: SectionProps) => {
  const queryClient = useQueryClient();
  
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    setActivatorNodeRef,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: "Section",
      section,
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
        key={section.id}
        borderTop={
          course.sections.length === 1 || sectionIndex === 0 ? "none" : ""
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
              <Text>{section.title}</Text>
            </Flex>
          </Box>
          <Flex alignItems="center">
            <EditSection course={course} section={section}/>
            <DeleteSection course={course} section={section}/>
            <AccordionIcon />
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Lessons course={course} section={section} />
        </AccordionPanel>
      </AccordionItem>
    </>
  );
};

export default Section;
