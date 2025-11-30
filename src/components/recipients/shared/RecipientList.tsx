import { Box, VStack, IconButton } from "@chakra-ui/react";
import { RecipientListProps } from "../../../types/recipients";
import { RecipientGroup } from "./RecipientGroup";
import { RecipientItem } from "./RecipientItem";

export const RecipientList = ({
  groups,
  individualRecipients,
  expandedGroups,
  onToggleGroup,
  onClickDomain,
  onClickRecipient,
  actionType,
}: RecipientListProps) => {
  return (
    <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
      <VStack align="stretch" gap={2}>
        {groups.map((group) => (
          <RecipientGroup
            key={group.domain}
            domain={group.domain}
            recipients={group.recipients}
            isExpanded={expandedGroups.has(group.domain)}
            onToggle={() => onToggleGroup(group.domain)}
            onClickDomain={onClickDomain ? () => onClickDomain(group.domain) : undefined}
            onClickRecipient={onClickRecipient}
            actionType={actionType}
            showDomainRemoveButton={actionType === 'remove'}
          />
        ))}
        {individualRecipients.map((recipient) => {
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

          return (
            <RecipientItem
              key={recipient.id}
              email={recipient.email}
              recipientId={recipient.id}
              onClick={onClickRecipient ? () => onClickRecipient(recipient.id) : undefined}
              action={action}
            />
          );
        })}
      </VStack>
    </Box>
  );
};

