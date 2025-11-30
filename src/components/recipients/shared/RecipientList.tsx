import { Box, VStack, IconButton, Text } from "@chakra-ui/react";
import { memo, useCallback, useMemo } from "react";
import { RecipientListProps } from "../../../types/recipients";
import { RecipientGroup } from "./RecipientGroup";
import { RecipientItem } from "./RecipientItem";

export const RecipientList = memo(({
  groups,
  individualRecipients,
  expandedGroups,
  onToggleGroup,
  onClickDomain,
  onClickRecipient,
  actionType,
  searchString = "",
}: RecipientListProps) => {
  // Stable callback factories to avoid creating new functions inside useMemo
  const createToggleHandler = useCallback(
    (domain: string) => () => onToggleGroup(domain),
    [onToggleGroup]
  );

  const createDomainClickHandler = useCallback(
    (domain: string) => onClickDomain ? () => onClickDomain(domain) : undefined,
    [onClickDomain]
  );

  const createRecipientClickHandler = useCallback(
    (recipientId: string) => onClickRecipient ? () => onClickRecipient(recipientId) : undefined,
    [onClickRecipient]
  );

  // Memoize group items to avoid recreating callbacks on each render
  const groupItems = useMemo(() => {
    return groups.map((group) => {
      const domain = group.domain;
      return {
        key: domain,
        domain,
        recipients: group.recipients,
        isExpanded: expandedGroups.has(domain),
        onToggle: createToggleHandler(domain),
        onClickDomain: createDomainClickHandler(domain),
      };
    });
  }, [groups, expandedGroups, createToggleHandler, createDomainClickHandler]);

  // Memoize individual recipient items
  const recipientItems = useMemo(() => {
    return individualRecipients.map((recipient) => {
      const action = onClickRecipient && actionType ? (
        <IconButton
          aria-label={actionType === 'add' ? "Add recipient" : "Remove recipient"}
          variant="ghost"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            onClickRecipient(recipient.id);
          }}
        >
          {actionType === 'add' ? '+' : '-'}
        </IconButton>
      ) : undefined;

      return {
        key: recipient.id,
        email: recipient.email,
        recipientId: recipient.id,
        onClick: createRecipientClickHandler(recipient.id),
        action,
      };
    });
  }, [individualRecipients, onClickRecipient, actionType, createRecipientClickHandler]);

  const isEmpty = groups.length === 0 && individualRecipients.length === 0;

  // Determine empty state message based on context
  const emptyStateMessage = useMemo(() => {
    if (searchString) {
      return "No recipients found matching your search";
    }
    if (actionType === 'remove') {
      return "No recipients selected";
    }
    return "No recipients available";
  }, [searchString, actionType]);

  return (
    <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
      {isEmpty ? (
        <Box py={8} textAlign="center">
          <Text color="gray.500" fontSize="sm">
            {emptyStateMessage}
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" gap={2}>
          {groupItems.map((item) => (
            <RecipientGroup
              key={item.key}
              domain={item.domain}
              recipients={item.recipients}
              isExpanded={item.isExpanded}
              onToggle={item.onToggle}
              onClickDomain={item.onClickDomain}
              onClickRecipient={onClickRecipient}
              actionType={actionType}
              showDomainRemoveButton={actionType === 'remove'}
              searchString={searchString}
            />
          ))}
          {recipientItems.map((item) => (
            <RecipientItem
              key={item.key}
              email={item.email}
              recipientId={item.recipientId}
              onClick={item.onClick}
              action={item.action}
              searchString={searchString}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
});

