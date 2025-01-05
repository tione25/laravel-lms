import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Stack,
  AlertIcon,
  Alert,
  Textarea,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { contact } from "../../../api/contact";
import toast from "react-hot-toast";

interface Inputs {
  email: string;
  subject: string;
  message: string;
}

const Form = () => {
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
      subject: "",
      message: "",
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["Contact"],
    mutationFn: contact,
    onSuccess: (data) => {
        toast.success('Your message has been sent!');
    },
    onError: (error) => {
      console.log("ContactMutation error: ", error);
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

      if (error?.errors?.subject) {
        setError("subject", {
          type: "server",
          message: error.errors?.subject,
        });
      }

      if (error?.errors?.email) {
        setError("email", {
          type: "server",
          message: error.errors?.email,
        });
      }

      if (error?.errors?.message) {
        setError("message", {
          type: "server",
          message: error.errors?.message,
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

          <FormControl isInvalid={Boolean(errors?.subject)}>
            <FormLabel htmlFor="email">Subject</FormLabel>
            <Input
              type="text"
              id="subject"
              placeholder="subject"
              {...register("subject", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.subject && errors.subject.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={Boolean(errors?.message)}>
            <FormLabel htmlFor="message">Message</FormLabel>
            <Textarea
              placeholder="Your message"
              {...register("message", {
                required: "This is required",
              })}
              aria-invalid={errors.message ? "true" : "false"}
            />
            <FormErrorMessage>
              {errors.message && errors?.message.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Send
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default Form;
