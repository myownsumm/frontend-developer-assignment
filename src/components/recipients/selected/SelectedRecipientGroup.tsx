import { Box, Text, IconButton } from "@chakra-ui/react";
import { SelectedRecipientGroupProps } from "../../../types/recipients";
import { SelectedRecipientItem } from "./SelectedRecipientItem";

export const SelectedRecipientGroup = ({
  groupName,
  recipients,
  isExpanded = false,
  onToggle,
  onRemoveDomain,
  onRemoveRecipient,
}: SelectedRecipientGroupProps) => {
  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        _hover={{ bg: "gray.50" }}
        borderRadius="md"
        p={1}
      >
        <Box
          display="flex"
          alignItems="center"
          cursor="pointer"
          flex={1}
          onClick={onToggle}
        >
          <IconButton
            aria-label={isExpanded ? "Collapse group" : "Expand group"}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </IconButton>
          <Text fontWeight="medium">{groupName}</Text>
        </Box>
        {onRemoveDomain && (
          <IconButton
            aria-label="Remove all recipients in this group"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveDomain();
            }}
          >
            ×
          </IconButton>
        )}
      </Box>
      {isExpanded && (
        <Box pl={6}>
          {recipients.map((recipient) => (
            <SelectedRecipientItem
              key={recipient.id}
              email={recipient.email}
              recipientId={recipient.id}
              onClick={() => onRemoveRecipient?.(recipient.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

