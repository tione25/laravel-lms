import { SubmitHandler, useForm } from "react-hook-form";
import SimpleHero from "../../../components/Front/ui/SimpleHero";
import { getUser } from "../../../services/useGetUser";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../../../api/user";
import toast from "react-hot-toast";
import { Helmet } from 'react-helmet';

interface Input {
  id: number;
  email: string;
  password: string;
  profile_image: string;
  profile_image_file: File | null;
}

const Profile = () => {
  const { data: user, isPending } = getUser();

  const [image, setImage] = useState(
    "https://sealms-api.levelcoding.com/storage/" + user?.profile_image
  );

  const queryClient = useQueryClient();

  const { mutateAsync: updateUserProfileMutation } = useMutation({
    mutationKey: ["CreateCategory"],
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["User"] });

      window.location.reload();
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      email: user?.email,
      profile_image: user?.profile_image,
      profile_image_file: null,
    },
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, onChange, ...rest } = register("profile_image_file");

  const handleClick = () => inputRef.current?.click();

  const onImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const onSubmit: SubmitHandler<Input> = async (values) => {
    try {
      await updateUserProfileMutation(values);
    } catch (e) {
      const error = e?.response?.data;

      if (error?.errors?.email) {
        setError("email", {
          type: "server",
          message: error.errors?.email[0],
        });
      }

      if (error?.errors?.password) {
        setError("password", {
          type: "server",
          message: error.errors?.password[0],
        });
      }
    }
  };

  useEffect(() => {
    setValue("email", user?.email);
    setImage("https://sealms-api.levelcoding.com/storage/" + user?.profile_image);
  }, [isPending, user]);

  if (!user) {
    return ""
  }

  return (
    <>
      <Helmet>
        <title>Profile | CourseCasts</title>
      </Helmet>

      <SimpleHero title="Profile" />
      <Flex
        flexDir="column"
        gap={2}
        maxW={"600px"}
        p={4}
        py={6}
        rounded="md"
        mx="auto"
      >
        {!isPending && user && (
          <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <FormErrorMessage>
                {errors.profile_image_file &&
                  errors.profile_image_file?.message}
              </FormErrorMessage>
              <InputGroup
                display="flex"
                justifyContent="center"
                onClick={handleClick}
              >
                <Input
                  type="file"
                  {...rest}
                  ref={(e) => {
                    ref(e);
                    inputRef.current = e;
                  }}
                  hidden
                  onChange={(e) => {
                    onImageChange(e);
                    onChange(e);
                  }}
                />
                <Flex flexDir="column" gap={4}>
                  <Box>
                    <Avatar
                      src={image ?? ""}
                      boxSize="70px"
                      objectFit="cover"
                    />
                  </Box>
                </Flex>
              </InputGroup>
            </Box>
            <Flex flexDir="column" gap={4}>
              <Box mt={10}>
                <FormControl isInvalid={Boolean(errors?.email)}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={Boolean(errors?.password)}>
                  <FormLabel htmlFor="password">New Password?</FormLabel>
                  <Input
                    placeholder="Choose a password..."
                    type="password"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <Button colorScheme="teal" type="submit">
                  Save
                </Button>
              </Box>
            </Flex>
          </form>
        )}
      </Flex>
    </>
  );
};

export default Profile;
