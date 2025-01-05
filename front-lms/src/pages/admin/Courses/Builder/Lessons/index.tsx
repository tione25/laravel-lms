import { useEffect, useState } from "react";
import NewLesson from "./NewLesson";
import { Accordion, Box } from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import Lesson from "./Lesson";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderCourseSectionLessons } from "../../../../../api/admin/course";
import toast from "react-hot-toast";

interface LessonProps {
  course: any;
  section: any;
}

const Lessons = ({ course, section }: LessonProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["Course"],
    mutationFn: orderCourseSectionLessons,
    onSuccess: () => {
      toast.success('Course updated');
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const [lessons, setLessons] = useState([
    ...(course.sections.find((s) => s.id === section.id)?.section_lessons ??
      []),
  ]);
  const [lessonsIds, setLessonsIds] = useState([
    ...(lessons.map((lesson) => lesson.id) ?? []),
  ]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonSelected, setLessonSelected] = useState(null);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Lesson") {
      setActiveLesson(event.active.data.current.lesson);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveLesson(null);

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
      active?.data?.current?.type === "Lesson" &&
      over?.data.current?.type === "Lesson"
    ) {
      setLessons((items) => {
        const oldIndex = lessons.findIndex((item) => active.id === item.id);
        const newIndex = lessons.findIndex((item) => over.id === item.id);

        items[oldIndex].order = newIndex;
        items[newIndex].order = oldIndex;

        updateSectionLessonsOrder(items[oldIndex], items[newIndex]);

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

  const updateSectionLessonsOrder = async (
    firstSectionLesson,
    secondSectionLesson
  ) => {
    try {
      await mutateAsync({
        first_section_lesson: firstSectionLesson,
        second_section_lesson: secondSectionLesson,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLessons([
      ...(course.sections.find((s) => s.id === section.id)?.section_lessons ??
        []),
    ]);
    setLessonsIds([...(lessons?.map((lesson) => lesson.id) ?? [])]);
  }, [course]);

  return (
    <>
      <NewLesson section={section} course={course} />

      <Box my={5}>
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
            <SortableContext items={lessonsIds}>
              {lessons.map((lesson, index) => (
                <Lesson
                  key={index}
                  course={course}
                  section={section}
                  lesson={lesson}
                  lessonIndex={index}
                  lessonSelected={lessonSelected}
                  setLessonSelected={setLessonSelected}
                />
              ))}
            </SortableContext>
          </Accordion>
        </DndContext>
      </Box>
    </>
  );
};

export default Lessons;
