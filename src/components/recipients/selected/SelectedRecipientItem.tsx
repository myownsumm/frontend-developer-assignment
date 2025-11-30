import { Text, Box, IconButton } from "@chakra-ui/react";
import { SelectedRecipientItemProps } from "../../../types/recipients";

export const SelectedRecipientItem = ({
  email,
  onClick,
}: SelectedRecipientItemProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      cursor="pointer"
      onClick={onClick}
      _hover={{ bg: "gray.50" }}
      borderRadius="md"
      p={1}
    >
      <Text>{email}</Text>
      <IconButton
        aria-label="Remove recipient"
        variant="ghost"
        size="xs"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        ×
      </IconButton>
    </Box>
  );
};

