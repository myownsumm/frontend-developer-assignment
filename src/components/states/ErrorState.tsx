import { Box, Text, VStack } from "@chakra-ui/react";

interface ErrorStateProps {
  error: Error;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={6}>
      <Box
        maxW="600px"
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        borderRadius="lg"
        p={6}
      >
        <VStack align="stretch" gap={2}>
          <Text fontSize="lg" fontWeight="semibold" color="red.800">
            Failed to load recipients
          </Text>
          <Text color="red.700">{error.message}</Text>
        </VStack>
      </Box>
    </Box>
  );
};

