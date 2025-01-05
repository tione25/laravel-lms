import { Box, HStack, Icon, Input } from "@chakra-ui/react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface StarProps {
  rating: number;
  setRating: (rating: number) => void;
  count?: number;
  size?: number;
  gap?: number;
  canHover: boolean;
}

const Star = ({ rating, setRating, count, size, gap, canHover }: StarProps) => {
  // count:  number of stars you want, pass as props
  //size: size of star that you want

  const [hover, setHover] = useState<number | null>(null);
  const [ratingValue, setRatingValue] = useState(rating);

  return (
    <HStack gap={gap ?? 2}>
      {[...Array(count || 5)].map((star, index) => {
        const value = index + 1;
        return (
          <Box
            key={index}
            onMouseEnter={() => {
              if (canHover) setHover(value);
            }}
            onMouseLeave={() => setHover(null)}
          >
            <Icon
              onClick={() => {
                setRating(value);
                setRatingValue(value);
              }}
              as={FaStar}
              cursor={"pointer"}
              fontSize={size || 20}
              transition="color 200ms"
              color={value <= (hover || ratingValue) ? "orange.300" : "gray.300"}
            />
          </Box>
        );
      })}
    </HStack>
  );
};

export default Star;
