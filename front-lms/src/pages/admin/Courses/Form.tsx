import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Button,
} from "@chakra-ui/react";
import General from "./Steps/General";
import { SubmitHandler, useForm } from "react-hook-form";
import Media from "./Steps/Media";
import Seo from "./Steps/Seo";
import Curriculum from "./Steps/Curriculum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeCourse, updateCourse, updateCourseStatus } from "../../../api/admin/course";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdPublish, MdUnpublished } from "react-icons/md";

interface FormProps {
  course?: any;
  categories?: any;
}

interface Input {
  id: number;
  title: string;
  category_id: number;
  status: string;
  short_description: string;
  description: string;
  type: string;
  preview_image: string;
  preview_image_file: File | null;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  is_free: string;
  price: number;
}

const Form = ({ course, categories }: FormProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: updateCourseStatusMutation } = useMutation({
    mutationKey: ["Course"],
    mutationFn: updateCourseStatus,
    onSuccess: () => {
      toast.success("course status updated!");
      queryClient.invalidateQueries({ queryKey: ["Course"], refetchType: 'all' });
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message);
    },
  });

  const { mutateAsync: storeNewCourseMutation } = useMutation({
    mutationKey: ["Course"],
    mutationFn: storeCourse,
    onSuccess: () => {
      toast.success("New course created!");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const { mutateAsync: updateCourseMutation } = useMutation({
    mutationKey: ["Course"],
    mutationFn: updateCourse,
    onSuccess: () => {
      toast.success("Course updated!");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const stepList = [
    { title: "Curriculum", description: "", active: !!course },
    { title: "General", description: "", active: true },
    { title: "Media", description: "", active: !!course },
    { title: "SEO", description: "", active: true },
    { title: "Complete", description: "", active: true },
  ];
  const filteredStepsList = stepList.filter((s) => s.active);

  const steps = useSteps({
    index: 0,
    count: filteredStepsList.length,
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
      id: course?.id,
      title: course?.title,
      category_id: course?.category.id,
      status: course?.status,
      short_description: course?.short_description,
      description: course?.description,
      type: course?.type,
      meta_title: course?.meta_title,
      meta_description: course?.meta_description,
      meta_keywords: course?.meta_keywords,
      is_free: course?.is_free,
      price: course?.price,
      preview_image: course?.preview_image,
      preview_image_file: null,
    },
  });

  const onSubmit: SubmitHandler<Input> = async (values) => {
    try {
      if (!course) {
        const response = await storeNewCourseMutation(values);
        setTimeout(
          () => navigate("/admin/courses/edit/" + response?.data.id),
          1000
        );
      } else {
        updateCourseMutation(values);
      }
    } catch (e) {
      const error = e.response.data;

      if (error.errors?.title) {
        setError("title", {
          type: "server",
          message: error.errors?.title,
        });
      }

      if (error.errors?.type) {
        setError("type", {
          type: "server",
          message: error.errors?.type,
        });
      }

      if (error.errors?.status) {
        setError("status", {
          type: "server",
          message: error.errors?.status,
        });
      }
    }
  };

  const goToNextStep = async () => {
    let isValid = true;

    if (steps.activeStep === 0) {
      isValid = await trigger([
        "title",
        "category_id",
        "status",
        "type",
        "short_description",
        "description",
      ]);
    }

    if (isValid) {
      if (steps.activeStep + 1 < stepList.length + 1) {
        steps.setActiveStep(steps.activeStep + 1);
      }
    }
  };

  const onPublish = async (status: boolean) => {
    try {
      await updateCourseStatusMutation({id: course?.id, status: status ? 'public' : 'draft'})
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {/* Stepper */}
      <Box overflowX="auto" mb={10}>
        <Stepper index={steps.activeStep}>
          {filteredStepsList.map((step, index) => (
            <Step key={index}>
              <StepIndicator
                onClick={() => {
                  if (course) {
                    steps.setActiveStep(index);
                  }
                }}
                cursor="pointer"
              >
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Builder */}
      <Box>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Box mt={10} display="flex" gap={4} justifyContent="flex-end">
            {steps.activeStep < filteredStepsList.length - 1 && (
              <Button colorScheme="blue" onClick={() => goToNextStep()}>
                Save & Next
              </Button>
            )}
            {(steps.activeStep === filteredStepsList.length - 1 || course) && (
              <Button colorScheme="teal" type="submit">
                Save
              </Button>
            )}
            {course && course.status === "draft" && (
              <Button
                leftIcon={<MdPublish />}
                colorScheme="green"
                variant="outline"
                type="button"
                onClick={() => onPublish(true)}
              >
                Publish
              </Button>
            )}
            {course && course.status === "public" && (
              <Button
                leftIcon={<MdUnpublished />}
                colorScheme="green"
                type="button"
                onClick={() => onPublish(false)}
              >
                Unpublish
              </Button>
            )}
          </Box>

          {filteredStepsList[steps.activeStep].title === "Curriculum" &&
            course && (
              <Box mt={4}>
                <Curriculum course={course} />
              </Box>
            )}

          {(filteredStepsList[steps.activeStep].title === "General" ||
            steps.activeStep === stepList.length - 1) && (
            <Box mt={4}>
              <General
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
                categories={categories}
              />
            </Box>
          )}

          {(filteredStepsList[steps.activeStep].title === "Media" ||
            (steps.activeStep === filteredStepsList.length - 1 && course)) && (
            <Box mt={4}>
              <Media course={course} register={register} errors={errors} />
            </Box>
          )}

          {(filteredStepsList[steps.activeStep].title === "SEO" ||
            steps.activeStep === filteredStepsList.length - 1) && (
            <Box mt={4}>
              <Seo
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
              />
            </Box>
          )}
        </form>
      </Box>
    </>
  );
};

export default Form;
