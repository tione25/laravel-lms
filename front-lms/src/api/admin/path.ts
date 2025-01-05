import { client } from "../../utils/client";

export function getPath({ id }) {
  return client.get("/admin/paths/" + id).then((response) => response.data);
}

export function updatePath(path) {
  return client.post(
    "/admin/paths/" + path.id,
    {
      ...path,
      preview_image_file: path.preview_image_file?.[0] ?? null,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}

export function storePath(path) {
  return client.post("/admin/paths", { ...path });
}

export function updatePathStatus(path) {
  return client.patch("admin/paths/" + path.id + "/publish", path);
}


export function deletePath(path) {
  return client.delete(`/admin/paths/${path.id}`);
}

export function storePathSection(section) {
  return client.post(`/admin/paths/${section?.pathId}/sections`, {
    ...section,
  });
}

export function updatePathSection(section) {
  return client.patch(`/admin/paths/sections/${section.id}`, {
    ...section,
  });
}

export function deletePathSection(section) {
  return client.delete(`/admin/paths/sections/${section.id}`);
}

export function orderPathSection(data) {
  return client.patch(`admin/paths/${data.path.id}/sections/order`, {
    first_section: data.first_section,
    second_section: data.second_section,
  });
}

export function storePathCourse({ section, course }) {
  return client.post(`/admin/paths/sections/${section.id}`, {
    course_id: course.id,
  });
}

export function deletePathCourse({ section, course }) {
  return client.delete(
    `/admin/paths/sections/${section.id}/courses/${course.id}`
  );
}

export function orderPathCourses(data) {
  return client.patch(`admin/paths/sections/${data.section.id}/courses/order`, {
    first_course: data.first_course,
    second_course: data.second_course,
  });
}
