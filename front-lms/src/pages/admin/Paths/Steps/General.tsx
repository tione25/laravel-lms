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
  return (
    <>
      <Heading fontSize="lg" mb={4}>
        General Information
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={10}>
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
      </SimpleGrid>
      <Box mb={10}>
        <FormControl isInvalid={Boolean(errors?.short_description)}>
          <FormLabel htmlFor="short_description">Short Description</FormLabel>
          <Textarea
            placeholder="Here is a sample placeholder"
            {...register("short_description")}
            aria-invalid={errors.short_description ? "true" : "false"}
          />
          <FormErrorMessage>
            {errors.short_description && errors?.short_description?.message}
          </FormErrorMessage>
        </FormControl>
      </Box>
      <Box>
        <FormControl isInvalid={Boolean(errors?.description)}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            placeholder="Here is a sample placeholder"
            {...register("description")}
            aria-invalid={errors.description ? "true" : "false"}
          />
          <FormErrorMessage>
            {errors.description && errors?.description?.message}
          </FormErrorMessage>
        </FormControl>
      </Box>
    </>
  );
};

export default General;
