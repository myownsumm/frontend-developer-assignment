import { Box, Text, IconButton } from "@chakra-ui/react";
import { AvailableRecipientGroupProps } from "../../../types/recipients";
import { AvailableRecipientItem } from "./AvailableRecipientItem";

export const AvailableRecipientGroup = ({
  domain,
  recipients,
  isExpanded = false,
  onToggle,
  onSelectDomain,
  onSelectRecipient,
}: AvailableRecipientGroupProps) => {
  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        cursor="pointer"
        onClick={onSelectDomain}
        _hover={{ bg: "gray.50" }}
        borderRadius="md"
        p={1}
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
        <Text fontWeight="medium">{domain}</Text>
      </Box>
      {isExpanded && (
        <Box pl={6}>
          {recipients.map((recipient) => (
            <AvailableRecipientItem
              key={recipient.id}
              email={recipient.email}
              recipientId={recipient.id}
              onClick={() => onSelectRecipient?.(recipient.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

