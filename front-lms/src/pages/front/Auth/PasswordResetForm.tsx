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
import { passwordReset } from "../../../api/user";
import toast from "react-hot-toast";

interface Inputs {
}

const PasswordResetForm = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["User"],
    mutationFn: passwordReset,
    onSuccess: (data) => {
      toast.success('We have sent you an email to reset your password!');
    },
    onError: (error) => {
      toast.error('Your account could not be found!');
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      const response = await mutateAsync(values);

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

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Reset
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default PasswordResetForm;
