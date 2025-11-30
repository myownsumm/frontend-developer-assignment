import { Text, Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { RecipientItemProps } from "../../../types/recipients";
import { highlightMatch } from "../../../lib/search";

export const RecipientItem = ({
  email,
  onClick,
  action,
  searchString = "",
}: RecipientItemProps) => {
  const highlightedEmail = useMemo(
    () => highlightMatch(email, searchString),
    [email, searchString]
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      _hover={{ bg: "gray.50" }}
      borderRadius="md"
      p={1}
    >
      <Text>{highlightedEmail}</Text>
      {action}
    </Box>
  );
};

