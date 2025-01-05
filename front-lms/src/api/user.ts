import { User } from "../services/useGetUser";
import { client } from "../utils/client";

export function login(user: User): Promise<User> {
  return client
    .post("/auth/login", { ...user })
    .then((response) => response.data);
}

export function registerUser(user: User): Promise<User> {
  return client
    .post("/auth/register", { ...user })
    .then((response) => response.data);
}

export function updateUserProfile(user: User): Promise<User> {
  return client.post(
    "/profile",
    {
      ...user,
      profile_image_file: user.profile_image_file?.[0] ?? null,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
}

export function logout() {
  return client.post("/auth/logout");
}

export function fetchUser(): Promise<User> {
  return client.get("/user").then((response) => response.data);
}

export function confirm(data) {
  return client
    .post("/auth/confirm", { ...data });
}

export function passwordReset(data) {
  return client
    .post("/auth/password/reset", { ...data });
}

export function passwordResetConfirm(data) {
  return client
    .post("/auth/password/reset/confirm", { ...data });
}