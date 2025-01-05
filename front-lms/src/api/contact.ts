import { client } from "../utils/client";

export function contact(data: {email: string, subject: string, message: string}) {
    return client
      .post("/contact", { ...data })
      .then((response) => response.data);
  }
  