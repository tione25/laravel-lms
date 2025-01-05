import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Stack,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { login } from "../../../api/user";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Inputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["User"],
    mutationFn: login,
    onSuccess: (data) => {
      toast.success('Welcome back!');
      queryClient.invalidateQueries({
        queryKey: ["User"],
      });
    },
    onError: (error) => {
      console.log("signInMutation error: ", error);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      const response = await mutateAsync(values);

      localStorage.setItem('authToken', response.token);

      queryClient.invalidateQueries();

      setTimeout(() => {
        window.location.href = '/';
      }, 500)
    } catch (e: any) {
      const error = e.response.data;

      if (error?.message) {
        setMessage(error.message);

        setTimeout(() => {
          setMessage("");
        }, 1500);
      }

      if (error?.errors?.email) {
        setError("email", {
          type: "server",
          message: error.errors?.email,
        });
      }

      if (error?.errors?.password) {
        setError("password", {
          type: "server",
          message: error.errors?.password,
        });
      }
    }
  };

  return (
    <>
      <form style={{display: "block", width: "100%"}} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {message != "" && (
            <Alert status="error" rounded="md">
              <AlertIcon />
              {message}
            </Alert>
          )}

          <FormControl isInvalid={Boolean(errors?.email)}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="email"
              {...register("email", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={Boolean(errors?.password)}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              id="password"
              placeholder="password"
              {...register("password", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Sign In
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default LoginForm;
