import { client } from "../../utils/client"

export default function getCourse(slug) {
    return client.get(`/courses/${slug}`).then((response) => response.data);
}

export function storeCourseFeedback(data) {
    return client.post(`/courses/feedback/${data.slug}`, data.feedback);
}