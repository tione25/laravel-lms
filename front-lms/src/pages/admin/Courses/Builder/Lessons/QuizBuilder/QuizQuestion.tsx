import {
  AccordionItem,
  IconButton,
  Input,
  Flex,
  Box,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Heading,
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Checkbox,
} from "@chakra-ui/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";

import { useMemo, useState } from "react";
import hljs from "highlight.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuizQuestionProps {
  question: any;
  updateQuestion: (question: any) => void;
  deleteQuestion: (question: any) => void;
  addOption: (option: any) => void;
  updateOption: (option: any) => void;
  deleteOption: (option: any) => void;
  questionIndex: number;
}

const QuizQuestion = ({
  question,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption,
  questionIndex,
}: QuizQuestionProps) => {
  const [editorState, setEditorState] = useState(question.description ?? "");
  const onEditorChange = (html) => {
    setEditorState(html);
    question.description = html;
  };
  const onEditorBlur = () => {
    updateQuestion(question)
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
      <AccordionItem
        borderTop={questionIndex === 0 ? "none" : ""}
        borderBottom="none"
      >
        <Box
          as="div"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={4}
          py={2}
          px={2}
          _hover={{ bg: "transparent" }}
          onClick={(e) => e.preventDefault()}
        >
          <IconButton
            icon={<MdDragIndicator />}
            aria-label=""
            colorScheme="unstyled"
            color="gray.600"
            fontSize={18}
            cursor="pointer"
            px={0}
          />
          <Input
            w="full"
            placeholder="Type a question..."
            defaultValue={question.question}
            onBlur={(e) => updateQuestion({
              ...question,
              question: e.target.value,
            })}
          />
          <Flex>
            <IconButton
              icon={<FaRegTrashAlt />}
              colorScheme="unstyled"
              color="gray.600"
              fontSize={16}
              aria-label=""
              onClick={() => deleteQuestion(question)}
            />
            <Flex gap={4}>
              <AccordionButton px={1} _hover={{ bg: "transparent" }}>
                <AccordionIcon />
              </AccordionButton>
            </Flex>
          </Flex>
        </Box>
        <AccordionPanel>
          <Box>
            <ReactQuill
              modules={modules}
              value={editorState}
              onChange={onEditorChange}
              onBlur={onEditorBlur}
              theme="snow" // Choose a Quill theme (optional)
            />
          </Box>
          <Flex alignItems="center" justifyContent="space-between" my={6}>
            <Heading fontSize="md" mb={4}>
              Options
            </Heading>
            <Button onClick={() => addOption(question)} size={"sm"}>
              Add Option
            </Button>
          </Flex>
          <Box>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Option</Th>
                    <Th>Correct</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {question.options.map((option, optionIndex) => (
                    <Tr key={"option-" + optionIndex}>
                      <Td>
                        <Input
                          w="full"
                          placeholder="Option..."
                          defaultValue={option.option}
                          onChange={(e) => (option.option = e.target.value)}
                          onBlur={(e) => updateOption({
                            ...option,
                            option: e.target.value,
                          })}
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          checked={option.is_correct}
                          defaultChecked={option.is_correct}
                          onChange={(e) => {
                            updateOption({
                              ...option,
                              is_correct: e.target.checked
                            });
                          }}
                        />
                      </Td>
                      <Td>
                        <Button
                          size={"sm"}
                          onClick={() => deleteOption(option)}
                        >
                          Remove
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </>
  );
};

export default QuizQuestion;
