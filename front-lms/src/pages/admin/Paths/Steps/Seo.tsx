import { FormControl, FormLabel, Heading, Input, SimpleGrid } from "@chakra-ui/react";

interface SeoProps {
  register: any;
  setValue: any;
  getValues: any;
  errors: any;
}

const Seo = ({ register, setValue, getValues, errors }: SeoProps) => {
  return (
    <>
      <Heading fontSize="lg" mb={4}>
        Seo
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <FormControl isInvalid={Boolean(errors?.meta_title)}>
            <FormLabel htmlFor="meta_title">Meta Title</FormLabel>
            <Input
              placeholder="Meta Title..."
              size="lg"
              {...register("meta_title")}
              aria-invalid={errors.meta_title ? "true" : "false"}
            />
          </FormControl>
          <FormControl isInvalid={Boolean(errors?.meta_keywords)}>
            <FormLabel htmlFor="meta_keywords">Meta Keywords</FormLabel>
            <Input
              placeholder="Meta Keywords..."
              size="lg"
              {...register("meta_keywords")}
              aria-invalid={errors.meta_keywords ? "true" : "false"}
            />
          </FormControl>
          <FormControl isInvalid={Boolean(errors?.meta_description)}>
            <FormLabel htmlFor="meta_description">Meta Description</FormLabel>
            <Input
              placeholder="Meta Description..."
              size="lg"
              {...register("meta_description")}
              aria-invalid={errors.meta_description ? "true" : "false"}
            />
          </FormControl>
        </SimpleGrid>
    </>
  );
};

export default Seo;
