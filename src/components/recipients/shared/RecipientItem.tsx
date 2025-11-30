import { Text, Box } from "@chakra-ui/react";
import { RecipientItemProps } from "../../../types/recipients";

export const RecipientItem = ({
  email,
  onClick,
  action,
}: RecipientItemProps) => {
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
      <Text>{email}</Text>
      {action}
    </Box>
  );
};

