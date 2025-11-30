import { Text, Box } from "@chakra-ui/react";
import { AvailableRecipientItemProps } from "../../../types/recipients";

export const AvailableRecipientItem = ({
  email,
  onClick,
}: AvailableRecipientItemProps) => {
  return (
    <Box
      cursor="pointer"
      onClick={onClick}
      _hover={{ bg: "gray.50" }}
      borderRadius="md"
      p={1}
    >
      <Text>{email}</Text>
    </Box>
  );
};

