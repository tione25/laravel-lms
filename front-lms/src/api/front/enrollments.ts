import { client } from "../../utils/client";

export function storeEnrollment(course) {
  return client.post(`/enrollments`, { ...course });
}


export function updateCompleteSectionLesson(data) {
  return client.patch(`/enrollments/${data.id}/sections/${data.course_section}/lessons/${data.section_lesson}/complete`);
}

export function updateEnrollmentOnVisit(data) {
  return client.patch(`/enrollments/${data.id}/sections/${data.course_section}/lessons/${data.section_lesson}`);
}

export function storeQuizEnrollment(data) {
  return client.patch(`/enrollments/${data.id}/sections/${data.course_section}/lessons/${data.section_lesson}/quiz`, {answers: data.answers});
}
