import { Box, VStack } from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import { AvailableRecipientListProps } from "../../../types/recipients";
import { availableExpandedGroupsAtom } from "../../../lib/atoms";
import {
  selectRecipientActionAtom,
  selectDomainRecipientsActionAtom,
} from "../../../lib/actions";
import { AvailableRecipientGroup } from "./AvailableRecipientGroup";
import { AvailableRecipientItem } from "./AvailableRecipientItem";

export const AvailableRecipientList = ({
  groups,
  individualRecipients,
}: AvailableRecipientListProps) => {
  const [expandedGroups, setExpandedGroups] = useAtom(availableExpandedGroupsAtom);
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
    <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
      <VStack align="stretch" gap={2}>
        {groups.map((group) => (
          <AvailableRecipientGroup
            key={group.domain}
            domain={group.domain}
            recipients={group.recipients}
            isExpanded={expandedGroups.has(group.domain)}
            onToggle={() => toggleGroup(group.domain)}
            onSelectDomain={() => selectDomainRecipients(group.domain)}
            onSelectRecipient={selectRecipient}
          />
        ))}
        {individualRecipients.map((recipient) => (
          <AvailableRecipientItem
            key={recipient.id}
            email={recipient.email}
            recipientId={recipient.id}
            onClick={() => selectRecipient(recipient.id)}
          />
        ))}
      </VStack>
    </Box>
  );
};

