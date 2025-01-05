import { Accordion, Box } from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { orderPathSection } from "../../../../api/admin/path";
import toast from "react-hot-toast";
import Section from "./Section/Section";
import NewSection from "./Section/NewSection";

interface BuilderProps {
  path: any;
}

const Builder = ({ path }: BuilderProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["PathSectionsOrder"],
    mutationFn: orderPathSection,
    onSuccess: () => {
      toast.success("Path Sections updated");
      queryClient.invalidateQueries({ queryKey: ["Path"] });
    },
  });

  const [sections, setSections] = useState([...(path?.sections ?? [])]);
  const [activeSection, setActiveSection] = useState(null);
  const [sectionSelected, setSectionSelected] = useState(null);

  const [sectionsIds, setSectiondsIds] = useState([
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

        updateSectionsOrder(path, items[oldIndex], items[newIndex]);

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

  const updateSectionsOrder = async (path, firstSection, secondSection) => {
    try {
      const response = await mutateAsync({
        first_section: firstSection,
        second_section: secondSection,
        path: path,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSections([...(path.sections ?? [])]);
    setSectiondsIds([...sections.map((section) => section.id)]);
  }, [path]);

  return (
    <>
      <NewSection path={path} />

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
                  path={path}
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
