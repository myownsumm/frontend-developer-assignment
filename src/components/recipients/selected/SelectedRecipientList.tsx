import { Box, VStack } from "@chakra-ui/react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { SelectedRecipientListProps } from "../../../types/recipients";
import { selectedExpandedGroupsAtom } from "../../../lib/atoms";
import {
  removeRecipientActionAtom,
  removeDomainRecipientsActionAtom,
} from "../../../lib/actions";
import { selectedRecipientGroupsAtom } from "../../../data-pipeline/memoize";
import { SelectedRecipientGroup } from "./SelectedRecipientGroup";

export const SelectedRecipientList = ({
  companyRecipients,
  emailRecipients,
}: SelectedRecipientListProps) => {
  const [expandedGroups, setExpandedGroups] = useAtom(selectedExpandedGroupsAtom);
  const removeRecipient = useSetAtom(removeRecipientActionAtom);
  const removeDomainRecipients = useSetAtom(removeDomainRecipientsActionAtom);
  const selectedGroups = useAtomValue(selectedRecipientGroupsAtom);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  // For company recipients: remove all recipients from domains with 2+ recipients
  const handleRemoveCompanyRecipients = () => {
    const companyDomains = selectedGroups
      .filter((group) => group.recipients.length > 1)
      .map((group) => group.domain);
    
    companyDomains.forEach((domain) => {
      removeDomainRecipients(domain);
    });
  };

  // For email recipients: remove all recipients from domains with 1 recipient
  const handleRemoveEmailRecipients = () => {
    const emailDomains = selectedGroups
      .filter((group) => group.recipients.length === 1)
      .map((group) => group.domain);
    
    emailDomains.forEach((domain) => {
      removeDomainRecipients(domain);
    });
  };

  return (
    <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
      <VStack align="stretch" gap={2}>
        <SelectedRecipientGroup
          groupName="company recipients"
          recipients={companyRecipients}
          isExpanded={expandedGroups.has("company recipients")}
          onToggle={() => toggleGroup("company recipients")}
          onRemoveDomain={handleRemoveCompanyRecipients}
          onRemoveRecipient={removeRecipient}
        />
        <SelectedRecipientGroup
          groupName="email recipients"
          recipients={emailRecipients}
          isExpanded={expandedGroups.has("email recipients")}
          onToggle={() => toggleGroup("email recipients")}
          onRemoveDomain={handleRemoveEmailRecipients}
          onRemoveRecipient={removeRecipient}
        />
      </VStack>
    </Box>
  );
};

