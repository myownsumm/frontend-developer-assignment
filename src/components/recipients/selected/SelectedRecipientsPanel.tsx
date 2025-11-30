import { Box, Text, VStack } from "@chakra-ui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { SearchBar } from "../available/SearchBar";
import { RecipientList } from "../shared/RecipientList";
import {
  selectedRecipientGroupsOnlyAtom,
  individualSelectedRecipientsAtom,
} from "../../../data-pipeline/memoize";
import { selectedExpandedGroupsAtom, selectedSearchStringAtom } from "../../../store/atoms";
import {
  removeRecipientActionAtom,
  removeDomainRecipientsActionAtom,
} from "../../../store/actions";
import { toggleSetItem } from "../../../lib/utils";

export const SelectedRecipientsPanel = () => {
  const groups = useAtomValue(selectedRecipientGroupsOnlyAtom);
  const individualRecipients = useAtomValue(individualSelectedRecipientsAtom);
  const [expandedGroups, setExpandedGroups] = useAtom(selectedExpandedGroupsAtom);
  const [searchString, setSearchString] = useAtom(selectedSearchStringAtom);
  const removeRecipient = useSetAtom(removeRecipientActionAtom);
  const removeDomainRecipients = useSetAtom(removeDomainRecipientsActionAtom);

  const toggleGroup = useCallback(
    (domain: string) => setExpandedGroups(toggleSetItem(domain)),
    [setExpandedGroups]
  );

  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor="gray.200"
      p={6}
    >
      <VStack align="stretch" gap={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Selected recipients
        </Text>
        <SearchBar value={searchString} onChange={setSearchString} />
        <RecipientList
          groups={groups}
          individualRecipients={individualRecipients}
          expandedGroups={expandedGroups}
          onToggleGroup={toggleGroup}
          onClickDomain={removeDomainRecipients}
          onClickRecipient={removeRecipient}
          searchString={searchString}
        />
      </VStack>
    </Box>
  );
};

