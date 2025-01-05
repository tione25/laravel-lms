import { client } from "../../utils/client";

export default function getPath(slug) {
    return client.get(`/paths/${slug}`).then((response) => response.data);
}