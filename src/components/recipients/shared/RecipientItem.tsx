import { Text, Box } from "@chakra-ui/react";
import { useMemo, memo } from "react";
import { RecipientItemProps } from "../../../types/recipients";
import { highlightMatch } from "../../../lib/search";

export const RecipientItem = memo(({
  email,
  onClick,
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
    </Box>
  );
});

