import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Flex,
  Button,
  Select,
  Box,
} from "@chakra-ui/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  storeNewCourseSectionLesson,
  updateCourseSectionLesson,
} from "../../../../../api/admin/course";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import php from "highlight.js/lib/languages/php";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface NewSectionFormProps {
  section: any;
  lesson?: any;
  setOpen: (value: boolean) => void;
}

interface Inputs {
  course_id: number;
  course_section_id: number;
  title: string;
  id?: number | null;
  status: string;
  type: string;
  video: string;
  description: string;
}

const Form = ({ section, lesson, setOpen }: NewSectionFormProps) => {
  const queryClient = useQueryClient();
  const [isVideo, setIsVideo] = useState(lesson?.type === "video");

  const { mutateAsync: storeNewSectionLessonMutation } = useMutation({
    mutationKey: ["Course"],
    mutationFn: storeNewCourseSectionLesson,
    onSuccess: () => {
      toast.success("Lesson created");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const { mutateAsync: editSectionLessonMutation } = useMutation({
    mutationKey: ["Course"],
    mutationFn: updateCourseSectionLesson,
    onSuccess: () => {
      toast.success("Lesson updated");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      course_section_id: section.id,
      id: lesson?.id,
      title: lesson?.title,
      status: lesson?.status,
      type: lesson?.type,
      video: lesson?.video,
      description: lesson?.description,
    },
  });

  const [editorState, setEditorState] = useState(lesson?.description);
  const onEditorChange = (html) => {
    setEditorState(html);
    setValue("description", html); // Update form value with editor content
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "code-block"],
        ["clean"],
        [
          {
            imageResize: {
              modules: ["Resize", "DisplaySize", "Toolbar"],
            },
          },
        ],
      ],
      syntax: {
        highlight: (text) => hljs.highlightAuto(text).value,
      },
    }),
    []
  );

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      if (lesson) {
        await editSectionLessonMutation(values);
      } else {
        await storeNewSectionLessonMutation(values);
      }

      setOpen(false);
    } catch (e: any) {
      const error = e?.response?.data;

      console.log(error);

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

      if (error.errors?.description) {
        setError("description", {
          type: "server",
          message: error.errors?.description,
        });
      }

      if (error.errors?.status) {
        setError("status", {
          type: "server",
          message: error.errors?.status,
        });
      }

      if (error.errors?.video) {
        setError("video", {
          type: "server",
          message: error.errors?.video,
        });
      }
    }
  };

  return (
    <>
      <form
        key={4}
        onSubmit={(e) => {
          e.stopPropagation();
          return handleSubmit(onSubmit)(e);
        }}
      >
        <Stack spacing={3} mb={6}>
          <FormControl isInvalid={Boolean(errors?.title)}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              type="title"
              id="title"
              placeholder="Title"
              {...register("title", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors?.type)}>
            <FormLabel htmlFor="type">Type</FormLabel>
            <Select
              placeholder="Select Type"
              {...register("type")}
              aria-invalid={errors.type ? "true" : "false"}
              onChange={(e) => {
                if (e.target.value === "text") {
                  setIsVideo(false)
                } else if (e.target.value === "video") {
                  setIsVideo(true)
                } else {
                  setIsVideo(null)
                }
              }}
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
            </Select>
            <FormErrorMessage>
              {errors.type && errors.type.message}
            </FormErrorMessage>
          </FormControl>
          {isVideo && (
            <FormControl isInvalid={Boolean(errors?.video)}>
              <FormLabel htmlFor="video">Video URL</FormLabel>
              <Input
                type="video"
                id="video"
                placeholder="Video URL"
                {...register("video")}
              />
              <FormErrorMessage>
                {errors.video && errors.video.message}
              </FormErrorMessage>
            </FormControl>
          )}
          <FormControl isInvalid={Boolean(errors?.description)}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Box>
              <ReactQuill
                modules={modules}
                value={editorState}
                onChange={onEditorChange}
                theme="snow" // Choose a Quill theme (optional)
              />
            </Box>
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
        <Flex justifyContent="flex-end" gap={4} mb={4}>
          <Button
            type="button"
            variant="ghost"
            mr={3}
            onClick={() => setOpen(false)}
          >
            Discard
          </Button>
          <Button type="submit" colorScheme="messenger">
            Save
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default Form;
