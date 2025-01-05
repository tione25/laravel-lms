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
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { registerUser } from "../../../api/user";
import { useNavigate } from "react-router-dom";

interface Inputs {
  email: string;
  name: string;
  password: string;
}

const RegisterForm = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["UserRegistration"],
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(
        "Please check your email for account confirmation"
      );
      
    },
    onError: (error) => {
      console.log("signUpMutation error: ", error);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      const response = await mutateAsync(values);
    } catch (e: any) {
      const error = e.response;

      if (error?.message) {
        setMessage(error.message);

        setTimeout(() => {
          setMessage("");
        }, 1500);
      }

      if (error?.errors?.name) {
        setError("name", {
          type: "server",
          message: error.errors?.name,
        });
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
      <form
        style={{ display: "block", width: "100%" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={3}>
          {message != "" && (
            <Alert status="error">
              <AlertIcon />
              {message}
            </Alert>
          )}

          <FormControl isInvalid={Boolean(errors?.email)}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              type="text"
              id="name"
              placeholder="name"
              {...register("name", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

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
            Sign Up
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default RegisterForm;
