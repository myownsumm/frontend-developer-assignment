import { Box, Text, VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { SearchBar } from "./SearchBar";
import { AvailableRecipientList } from "./AvailableRecipientList";
import {
  availableRecipientGroupsOnlyAtom,
  individualAvailableRecipientsAtom,
} from "../../../data-pipeline/memoize";

export const AvailableRecipientsPanel = () => {
  const groups = useAtomValue(availableRecipientGroupsOnlyAtom);
  const individualRecipients = useAtomValue(individualAvailableRecipientsAtom);

  return (
    <Box>
      <VStack align="stretch" gap={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Available recipients
        </Text>
        <SearchBar />
        <AvailableRecipientList
          groups={groups}
          individualRecipients={individualRecipients}
        />
      </VStack>
    </Box>
  );
};

