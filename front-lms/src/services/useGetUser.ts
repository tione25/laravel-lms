import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { fetchUser } from "../api/user";

export type User = {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  profile_image: string;
  profile_image_file?: any;
};

export const getUser = (): UseQueryResult<User, Error> => {
  const { data: token } = useQuery({
    queryKey: ["authToken"],
    queryFn: () => localStorage.getItem("authToken"),
  });

  return useQuery<User, Error, User>({
    queryKey: ["User", token],
    queryFn: fetchUser,
    enabled: !!token,
    retry: 0,
  });
};
