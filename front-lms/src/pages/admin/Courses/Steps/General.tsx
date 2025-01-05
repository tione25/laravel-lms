import {
  SimpleGrid,
  Input,
  Textarea,
  Box,
  Select,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

import { useMemo, useState } from "react";
import hljs from "highlight.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface GeneralProps {
  categories: any;
  register: any;
  setValue: any;
  getValues: any;
  errors: any;
}

const General = ({
  categories,
  register,
  setValue,
  getValues,
  errors,
}: GeneralProps) => {

  const [editorState, setEditorState] = useState(getValues('description') ?? '');
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

  return (
    <>
      <Heading fontSize="lg" mb={4}>
        General Information
      </Heading>
      <Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <FormControl isInvalid={Boolean(errors?.title)}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              placeholder="Title..."
              size="lg"
              {...register("title", { required: "Title is required" })}
              aria-invalid={errors.title ? "true" : "false"}
            />
            <FormErrorMessage>
              {errors.title && errors?.title?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors?.category_id)}>
            <FormLabel htmlFor="category_id">Category</FormLabel>
            <Select
              placeholder="Category"
              size="lg"
              {...register("category_id", {
                required: "Category is required.",
              })}
              aria-invalid={errors.category_id ? "true" : "false"}
            >
              {categories?.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {errors.category_id && errors?.category_id?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors?.type)}>
            <FormLabel htmlFor="title">Course Type</FormLabel>
            <Select
              placeholder="Course Type"
              size="lg"
              {...register("type", { required: "Type is required." })}
              aria-invalid={errors.type ? "true" : "false"}
            >
              <option value="recorded">Recorded</option>
              <option value="text">Text</option>
            </Select>
            <FormErrorMessage>
              {errors.type && errors?.type?.message}
            </FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <Box mt={10}>
          <FormControl isInvalid={Boolean(errors?.short_description)}>
            <FormLabel htmlFor="short_description">Short Description</FormLabel>
            <Textarea
              placeholder="Here is a sample placeholder"
              {...register("short_description")}
              aria-invalid={errors.short_description ? "true" : "false"}
            />
          </FormControl>
          <FormErrorMessage>
            {errors.short_description && errors?.short_description?.message}
          </FormErrorMessage>
        </Box>

        <Box mt={10}>
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
          </FormControl>
          <FormErrorMessage>
            {errors.description && errors?.description?.message}
          </FormErrorMessage>
        </Box>
      </Box>
    </>
  );
};

export default General;
