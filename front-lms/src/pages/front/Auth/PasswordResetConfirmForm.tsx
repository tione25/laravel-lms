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
import { passwordResetConfirm } from "../../../api/user";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface Inputs {
  email: string;
  password: string;
  token: string;
}

const PasswordResetConfirmForm = () => {
  const data = useParams();
  const navigate = useNavigate();
  
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      password: "",
      email: data.email,
      token: data.token,
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["User"],
    mutationFn: passwordResetConfirm,
    onSuccess: (data) => {
      navigate("/login");
      toast.success('Your password has been reset. Please sign in!');
    },
    onError: (error) => {
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      const response = await mutateAsync(values);

      queryClient.invalidateQueries();
    } catch (e: any) {
      const error = e.response.data;

      if (error?.message) {
        setMessage(error.message);

        
        setTimeout(() => {
          setMessage("");
        }, 1500);
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

          <FormControl isInvalid={Boolean(errors?.password)}>
            <FormLabel htmlFor="password">New Password</FormLabel>
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
            Reset Password
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default PasswordResetConfirmForm;
