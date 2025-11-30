import { Box, Text, VStack } from "@chakra-ui/react";

export const LoadingState = () => {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <VStack gap={4}>
        <Box
          width="40px"
          height="40px"
          border="4px solid"
          borderColor="gray.200"
          borderTopColor="blue.500"
          borderRadius="50%"
          className="spinner"
        />
        <Text color="gray.600" fontSize="md">
          Loading recipients...
        </Text>
      </VStack>
    </Box>
  );
};

