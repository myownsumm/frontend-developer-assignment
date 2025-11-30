import { Input, Box, Text } from "@chakra-ui/react";
import { SearchBarProps } from "../../../types/recipients";

export const SearchBar = ({ placeholder = "search", value, onChange }: SearchBarProps) => {
  return (
    <Box position="relative">
      <Text
        position="absolute"
        left="12px"
        top="50%"
        transform="translateY(-50%)"
        color="gray.300"
        pointerEvents="none"
        zIndex={1}
      >
        🔍
      </Text>
      <Input
        placeholder={placeholder}
        pl="40px"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
};

