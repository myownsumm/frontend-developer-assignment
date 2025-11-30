import { Box, Text, IconButton } from "@chakra-ui/react";
import { useMemo, memo } from "react";
import { RecipientGroupProps } from "../../../types/recipients";
import { RecipientItem } from "./RecipientItem";
import { highlightMatch } from "../../../lib/search";

export const RecipientGroup = memo(({
  domain,
  recipients,
  isExpanded = false,
  onToggle,
  onClickDomain,
  onClickRecipient,
  searchString = "",
}: RecipientGroupProps) => {
  const highlightedDomain = useMemo(
    () => highlightMatch(domain, searchString),
    [domain, searchString]
  );

  // Memoize recipient items to avoid recreating callbacks on each render
  const recipientItems = useMemo(() => {
    return recipients.map((recipient) => {
      return {
        key: recipient.id,
        email: recipient.email,
        recipientId: recipient.id,
        onClick: onClickRecipient
          ? () => onClickRecipient(recipient.id)
          : undefined,
      };
    });
  }, [recipients, onClickRecipient]);

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
          cursor={onClickDomain ? "pointer" : "default"}
          flex={1}
          onClick={onClickDomain}
          data-testid={`domain-clickable-${domain}`}
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
          <Text fontWeight="medium" data-testid={`domain-text-${domain}`}>{highlightedDomain}</Text>
        </Box>
      </Box>
      {isExpanded && (
        <Box pl={6}>
          {recipientItems.map((item) => (
            <RecipientItem
              key={item.key}
              email={item.email}
              recipientId={item.recipientId}
              onClick={item.onClick}
              searchString={searchString}
            />
          ))}
        </Box>
      )}
    </Box>
  );
});
