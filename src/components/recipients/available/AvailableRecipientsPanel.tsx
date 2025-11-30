import { Box, Text, VStack } from "@chakra-ui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SearchBar } from "./SearchBar";
import { RecipientList } from "../shared/RecipientList";
import {
  availableRecipientGroupsOnlyAtom,
  individualAvailableRecipientsAtom,
} from "../../../data-pipeline/memoize";
import { availableExpandedGroupsAtom, availableSearchStringAtom } from "../../../lib/atoms";
import {
  selectRecipientActionAtom,
  selectDomainRecipientsActionAtom,
} from "../../../lib/actions";

export const AvailableRecipientsPanel = () => {
  const groups = useAtomValue(availableRecipientGroupsOnlyAtom);
  const individualRecipients = useAtomValue(individualAvailableRecipientsAtom);
  const [expandedGroups, setExpandedGroups] = useAtom(availableExpandedGroupsAtom);
  const [searchString, setSearchString] = useAtom(availableSearchStringAtom);
  const selectRecipient = useSetAtom(selectRecipientActionAtom);
  const selectDomainRecipients = useSetAtom(selectDomainRecipientsActionAtom);

  const toggleGroup = (domain: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) {
        next.delete(domain);
      } else {
        next.add(domain);
      }
      return next;
    });
  };

  return (
    <Box>
      <VStack align="stretch" gap={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Available recipients
        </Text>
        <SearchBar value={searchString} onChange={setSearchString} />
        <RecipientList
          groups={groups}
          individualRecipients={individualRecipients}
          expandedGroups={expandedGroups}
          onToggleGroup={toggleGroup}
          onClickDomain={selectDomainRecipients}
          onClickRecipient={selectRecipient}
          actionType="add"
        />
      </VStack>
    </Box>
  );
};

