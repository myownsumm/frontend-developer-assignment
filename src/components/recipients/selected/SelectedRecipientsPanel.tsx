import { Box, Text, VStack } from "@chakra-ui/react";
import { SelectedRecipientsPanelProps } from "../../../types/recipients";
import { SelectedRecipientList } from "./SelectedRecipientList";

export const SelectedRecipientsPanel = ({
  companyRecipients,
  emailRecipients,
}: SelectedRecipientsPanelProps) => {
  return (
    <Box>
      <VStack align="stretch" gap={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Selected recipients
        </Text>
        <SelectedRecipientList
          companyRecipients={companyRecipients}
          emailRecipients={emailRecipients}
        />
      </VStack>
    </Box>
  );
};

