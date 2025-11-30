import { Box, Text, VStack } from "@chakra-ui/react";

export const EmptyState = () => {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={6}>
      <Box
        maxW="600px"
        bg="blue.50"
        border="1px solid"
        borderColor="blue.200"
        borderRadius="lg"
        p={6}
      >
        <VStack align="stretch" gap={2}>
          <Text fontSize="lg" fontWeight="semibold" color="blue.800">
            No recipients available
          </Text>
          <Text color="blue.700">The recipients data appears to be empty.</Text>
        </VStack>
      </Box>
    </Box>
  );
};

