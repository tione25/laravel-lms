import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { confirm } from "../../../api/user";
import toast from "react-hot-toast";
import { Flex, Heading, Divider, Text, Button } from "@chakra-ui/react";

const Confirm = () => {
  const data = useParams();
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationKey: ["UserConfirmation"],
    mutationFn: confirm,
    onSuccess: (data) => {
      navigate("/login");
      toast.success("Your account has been confirmed please sign in!");
    },
    onError: (error) => {
      navigate("/");
      toast.error("Something went wrong!");
      console.log("signInMutation error: ", error);
    },
  });

  const confirmAccount = async () => {
    try {
      const response = await mutateAsync({
        email: data.email,
        token: data.token,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Flex
        flexDir="column"
        gap={2}
        maxW={"600px"}
        border="1px"
        borderColor="gray.300"
        p={4}
        py={6}
        rounded="md"
        mx="auto"
      >
        <Heading fontSize="2xl">
          <Text>Confirm Account</Text>
          <Divider my={4} />
        </Heading>
        <Button
          w="full"
          display="flex"
          size="sm"
          rounded="md"
          color="white"
          bg="teal.500"
          _hover={{
            bg: ["blue.400"],
            textDecor: "none",
          }}
          onClick={confirmAccount}
        >
          Confirm
        </Button>
      </Flex>
    </>
  );
};

export default Confirm;
