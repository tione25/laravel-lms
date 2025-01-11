import {
  Heading,
  InputGroup,
  Box,
  Image,
  Flex,
  Button,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

interface MediaProps {
  course: any;
  register: any;
  errors: any;
}

const Media = ({ register, errors, course }: MediaProps) => {
  let url = import.meta.env.VITE_API_BASE_URL;
  url = url.replace(/\/api\/$/, `/storage/`);

  const [image, setImage] = useState(
    url + course.preview_image
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, onChange, ...rest } = register('preview_image_file')

  const handleClick = () => inputRef.current?.click();

  const onImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <>
      <Heading fontSize="lg" mb={4}>
        Media
      </Heading>
      <FormErrorMessage>
        {errors.preview_image_file && errors.preview_image_file?.message}
      </FormErrorMessage>
      <InputGroup onClick={handleClick}>
        <Input
          type="file"
          {...rest}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          hidden
          onChange={(e) => {
            onImageChange(e)
            onChange(e)
          }}
        />
        <Flex flexDir="column" gap={4}>
          <Button>Upload Preview Image</Button>
          <Box>
            <Image
              src={image ?? ""}
              fallbackSrc="https://via.placeholder.com/800"
              boxSize="500px"
              objectFit="cover"
            />
          </Box>
        </Flex>
      </InputGroup>
    </>
  );
};

export default Media;
