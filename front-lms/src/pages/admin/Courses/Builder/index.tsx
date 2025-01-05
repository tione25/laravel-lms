import {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DndContext,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { orderCourseSections } from "../../../../api/admin/course";
import { Accordion, Box } from "@chakra-ui/react";
import NewSection from "./Section/NewSection";
import Section from "./Section/Section";
import toast from "react-hot-toast";

interface BuilderProps {
  course: any;
}

const Builder = ({ course }: BuilderProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["Course"],
    mutationFn: orderCourseSections,
    onSuccess: () => {
      toast.success("Course updated");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const [sections, setSections] = useState([...course?.sections]);
  const [activeSection, setActiveSection] = useState(null);
  const [sectionSelected, setSectionSelected] = useState(null);

  const [sectionsIds, setSectionsIds] = useState([
    ...sections.map((section) => section.id),
  ]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Section") {
      setActiveSection(event.active.data.current.section);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveSection(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    if (
      active?.data?.current?.type === "Section" &&
      over?.data.current?.type === "Section"
    ) {
      setSections((items) => {
        const oldIndex = sections.findIndex((item) => active.id === item.id);
        const newIndex = sections.findIndex((item) => over.id === item.id);

        items[oldIndex].order = newIndex;
        items[newIndex].order = oldIndex;

        updateSectionsOrder(items[oldIndex], items[newIndex]);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }
  };

  const updateSectionsOrder = async (firstSection, secondSection) => {
    try {
      await mutateAsync({
        first_section: firstSection,
        second_section: secondSection,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSections([...course.sections]);
    setSectionsIds([...sections.map((section) => section.id)]);
  }, [course]);

  return (
    <>
      <NewSection course={course} />

      <Box my={10}>
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <Accordion
            border="1px"
            rounded={10}
            borderColor="gray.300"
            allowToggle
          >
            <SortableContext items={sectionsIds}>
              {sections.map((section, index) => (
                <Section
                  key={index}
                  course={course}
                  section={section}
                  sectionIndex={index}
                  sectionSelected={sectionSelected}
                  setSectionSelected={setSectionSelected}
                />
              ))}
            </SortableContext>
          </Accordion>
        </DndContext>
      </Box>
    </>
  );
};

export default Builder;
