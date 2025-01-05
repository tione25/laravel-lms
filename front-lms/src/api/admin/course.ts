import { client } from "../../utils/client";

export function getCourse({ id }) {
  return client.get("/admin/courses/" + id).then((response) => response.data);
}

export function updateCourse(course) {
  return client.post(
    "/admin/courses/" + course.id,
    {
        ...course,
        preview_image_file: course.preview_image_file?.[0] ?? null,
    },
    {
        headers: { "Content-Type": "multipart/form-data",},
    }
  );
}

export function updateCourseStatus(course) {
  return client.patch("admin/courses/" + course.id + '/publish', course);
}

export function storeCourse(course) {
  return client.post("/admin/courses", { ...course });
}

export function deleteCourse(course) {
  return client.delete(`/admin/courses/${course.id}`);
}

// course sections

export function storeNewCourseSection(courseSection) {
  return client.post(`/admin/courses/${courseSection.courseId}/sections`, {
    ...courseSection,
  });
}

export function updateCourseSection(courseSection) {
  return client.patch(`/admin/sections/${courseSection.id}`, {
    ...courseSection,
  });
}

export function deleteCourseSection(courseSection) {
  return client.delete(`/admin/sections/${courseSection.id}`);
}

// ordering
export function orderCourseSections(data) {
  return client.patch("admin/sections/order", data);
}

// course sections lessons

export function storeNewCourseSectionLesson(sectionLesson) {
  return client.post(
    `/admin/courses/${sectionLesson.course_section_id}/lessons`,
    { ...sectionLesson }
  );
}

export function updateCourseSectionLesson(sectionLesson) {
  return client.patch(`/admin/lessons/${sectionLesson.id}`, {
    ...sectionLesson,
  });
}

export function deleteCourseSectionLesson(sectionLesson) {
  return client.delete(`/admin/lessons/${sectionLesson.id}`);
}

export function orderCourseSectionLessons(data) {
  return client.patch("admin/lessons/order", data);
}

// course section lesson quizz
export function storeNewCourseSectionLessonQuiz(data) {
  return client.post(
    `/admin/sections/${data.sectionId}/quiz`,
    { ...data }
  );
}

export function updateCourseSectionLessonQuiz(data) {
  return client.patch(
    `/admin/quizzes/${data.id}`,
    { ...data }
  );
}