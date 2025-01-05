import {
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import Star from "../../../../components/Front/StarRating/Star";
import { SubmitHandler, useForm } from "react-hook-form";
import { storeCourseFeedback } from "../../../../api/front/courses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface FeedbackModalProps {
  course: any
}

interface Input {
  rate: number;
  message: string;
}

const FeedbackModal = ({ course }: FeedbackModalProps) => {
  const [open, setOpen] = useState(true);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["Feedback"],
    mutationFn: storeCourseFeedback,
    onSuccess: (data) => {
      toast.success('Thank you for your feedback!');
    },
    onError: (error) => {
      console.log("StoreFeedbackMutation error: ", error);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    setError,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      rate: 3,
      message: "",
    },
  });

  const onSubmit: SubmitHandler<Input> = async (values)  => {
    console.log(course);
    try {
      await mutateAsync({slug: course?.slug, feedback: values})

      setOpen(false);
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={open}
        size="lg"
        onClose={() => setOpen(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent overflow="hidden">
          <ModalHeader>
            <Text textAlign="center" fontSize="3xl" py={2.5}>
              Your opinion matters to us!
            </Text>
          </ModalHeader>
          <ModalBody p={0}>
            <Box bg="gray.100" py={8}>
              <Text textAlign="center" fontSize="lg" color="gray.700">
              How was quality of the course?
              </Text>
              <Flex alignItems="center" justifyContent="center" py={4}>
                <Star
                  rating={getValues("rate")}
                  setRating={(rate) => setValue("rate", rate)}
                  canHover={true}
                  size={40}
                  gap={4}
                />
              </Flex>
              <Flex w="full">
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "block", width: "100%" }}>
                  <FormControl
                    isInvalid={Boolean(errors?.message)}
                    w="350px"
                    display="flex"
                    flexDir="column"
                    justifyContent="center"
                    alignItems="center"
                    mx={"auto"}
                  >
                    <Textarea
                      placeholder="Leave a message if you want..."
                      size="lg"
                      fontSize="sm"
                      {...register("message")}
                      aria-invalid={errors.message ? "true" : "false"}
                      bg="white"
                      h={28}
                      rounded="xl"
                      _placeholder={{color: "gray.400"}}
                      py={4}
                    />
                    <FormErrorMessage>
                      {errors.message && errors?.message?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Input type="number" hidden {...register("rate")} />
                  <Flex w="full" alignItems="center" justifyContent="center" mt={6}>
                    <Button type="submit" colorScheme="purple" size="lg" w="350px" rounded="xl">
                      Rate Now
                    </Button>
                  </Flex>
                </form>
              </Flex>
            </Box>
            <Flex bg="white" w="full" p={6} justifyContent="center">
              <Text color="gray.500" cursor="pointer" onClick={() => setOpen(false)}>
                Maybe later
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FeedbackModal;
