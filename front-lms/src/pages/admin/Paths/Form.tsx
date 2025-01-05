import {
  Box,
  Button,
  Input,
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
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import General from "./Steps/General";
import Curriculum from "./Steps/Curriculum";
import Seo from "./Steps/Seo";
import Media from "./Steps/Media";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  storePath,
  updatePath,
  updatePathStatus,
} from "../../../api/admin/path";
import toast from "react-hot-toast";
import { MdPublish, MdUnpublished } from "react-icons/md";

interface PathProps {
  path?: any | null;
  categories: any;
}

interface Input {
  id: number;
  title: string;
  description: string;
  short_description: string;
  category_id: number;
  status: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  preview_image: string;
  preview_image_file: File | null;
}

const Form = ({ path, categories }: PathProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const { mutateAsync: storeNewPathMutation } = useMutation({
    mutationKey: ["Path"],
    mutationFn: storePath,
    onSuccess: () => {
      toast.success("Path created");
      queryClient.invalidateQueries({ queryKey: ["Path", id] });
    },
  });

  const { mutateAsync: updateNewPathMutation } = useMutation({
    mutationKey: ["Path"],
    mutationFn: updatePath,
    onSuccess: () => {
      toast.success("Path updated");
      queryClient.invalidateQueries({ queryKey: ["Path", id] });
    },
  });

  const { mutateAsync: updatePathStatusMutation } = useMutation({
    mutationKey: ["Path"],
    mutationFn: updatePathStatus,
    onSuccess: () => {
      toast.success("Path status updated!");
      queryClient.invalidateQueries({
        queryKey: ["Path", id],
        refetchType: "all",
      });
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message);
    },
  });

  const stepList = [
    { title: "Curriculum", description: "", active: !!path },
    { title: "General", description: "", active: true },
    { title: "Media", description: "", active: !!path },
    { title: "Seo", description: "", active: true },
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
  } = useForm({
    defaultValues: {
      id: path?.id,
      title: path?.title,
      description: path?.description,
      short_description: path?.short_description,
      category_id: path?.category?.id,
      status: path?.status ?? 'draft',
      meta_title: path?.meta_title,
      meta_keywords: path?.meta_keywords,
      meta_description: path?.meta_description,
      preview_image: path?.preview_image,
      preview_image_file: null,
    },
  });

  const onSubmit: SubmitHandler<Input> = async (values) => {
    try {
      if (!path) {
        const response = await storeNewPathMutation(values);
        setTimeout(
          () => navigate("/admin/paths/edit/" + response?.data.id),
          1000
        );
      } else {
        await updateNewPathMutation(values);
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
        setError("title", {
          type: "server",
          message: error.errors?.title,
        });
      }

      if (error.errors?.status) {
        setError("title", {
          type: "server",
          message: error.errors?.title,
        });
      }
    }
  };

  const onPublish = async (status: boolean) => {
    try {
      await updatePathStatusMutation({
        id: path?.id,
        status: status ? "public" : "draft",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const goToNextStep = async () => {
    let isValid = true;

    if (steps.activeStep === 0) {
      isValid = await trigger([
        "title",
        "category_id",
        "status",
        "short_description",
        "description",
      ]);
    }

    if (isValid) {
      if (steps.activeStep + 1 < filteredStepsList.length + 1) {
        steps.setActiveStep(steps.activeStep + 1);
      }
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
                  if (path) {
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

      <Box>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Box
            mt={10}
            display="flex"
            gap={4}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Box display="flex" gap={4}>
              {steps.activeStep < filteredStepsList.length - 1 && (
                <Button colorScheme="blue" onClick={() => goToNextStep()}>
                  Save & Next
                </Button>
              )}
              {(steps.activeStep === filteredStepsList.length - 1 || path) && (
                <Button colorScheme="teal" type="submit">
                  Save
                </Button>
              )}
              {path && path.status === "draft" && (
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
              {path && path.status === "public" && (
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
          </Box>

          {filteredStepsList[steps.activeStep].title === "Curriculum" &&
            path && (
              <Box mt={4}>
                <Curriculum path={path} />
              </Box>
            )}

          {(filteredStepsList[steps.activeStep].title === "General" ||
            steps.activeStep === filteredStepsList.length - 1) && (
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
            (steps.activeStep === filteredStepsList.length - 1 && path)) && (
            <Box mt={4}>
              <Media path={path} register={register} errors={errors} />
            </Box>
          )}

          {(filteredStepsList[steps.activeStep].title === "Seo" ||
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
