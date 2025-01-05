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
import CourseItem from "./CourseItem";
import { orderPathCourses } from "../../../../../api/admin/path";
import toast from "react-hot-toast";
import SearchCourseModal from "../../SearchCourses/SearchCourseModal";
import { useParams } from "react-router-dom";

interface BuilderProps {
  path: any;
  section: any;
}

const Builder = ({ path, section }: BuilderProps) => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { mutateAsync } = useMutation({
    mutationKey: ["PathCoursesOrder"],
    mutationFn: orderPathCourses,
    onSuccess: () => {
      toast.success("Path updated");
      queryClient.invalidateQueries({ queryKey: ["Path", id] });
    },
  });

  const [courses, setCourses] = useState([...(path.sections.find((s) => s.id === section.id)?.courses ?? [])]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [courseSelected, setCourseSelected] = useState(null);

  const [coursesIds, setCoursesIds] = useState([
    ...courses.map((course) => course.id),
  ]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Section") {
      setActiveCourse(event.active.data.current.section);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveCourse(null);

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
      active?.data?.current?.type === "Course" &&
      over?.data.current?.type === "Course"
    ) {
      setCourses((items) => {
        const oldIndex = courses.findIndex((item) => active.id === item.id);
        const newIndex = courses.findIndex((item) => over.id === item.id);

        items[oldIndex].order = newIndex;
        items[newIndex].order = oldIndex;

        updateCoursesOrder(path, items[oldIndex], items[newIndex]);

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

  const updateCoursesOrder = async (section, firstCourse, secondCourse) => {
    try {
      await mutateAsync({
        first_course: firstCourse,
        second_course: secondCourse,
        section,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCourses([...path.sections.find((s) => s.id === section.id)?.courses]);
    setCoursesIds([...courses.map((section) => section.id)]);
  }, [path]);

  return (
    <>
      <Box my={10}>
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <Box mb={4}>
            <SearchCourseModal section={section} />
          </Box>
          <Accordion
            border="1px"
            rounded={10}
            borderColor="gray.300"
            allowToggle
          >
            <SortableContext items={coursesIds}>
              {courses.map((course, index) => (
                <CourseItem
                  key={index}
                  path={path}
                  section={section}
                  course={course}
                  sectionIndex={index}
                  courseSelected={courseSelected}
                  setCourseSelected={setCourseSelected}
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
