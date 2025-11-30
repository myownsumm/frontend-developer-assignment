import { Box, Text, IconButton } from "@chakra-ui/react";
import { useMemo } from "react";
import { RecipientGroupProps } from "../../../types/recipients";
import { RecipientItem } from "./RecipientItem";
import { highlightMatch } from "../../../lib/search";

export const RecipientGroup = ({
  domain,
  recipients,
  isExpanded = false,
  onToggle,
  onClickDomain,
  onClickRecipient,
  actionType,
  showDomainRemoveButton = false,
  searchString = "",
}: RecipientGroupProps) => {
  const highlightedDomain = useMemo(
    () => highlightMatch(domain, searchString),
    [domain, searchString]
  );
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
        {showDomainRemoveButton && onClickDomain && (
          <IconButton
            aria-label="Remove all recipients in this group"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClickDomain();
            }}
          >
            -
          </IconButton>
        )}
      </Box>
      {isExpanded && (
        <Box pl={6}>
          {recipients.map((recipient) => {
            const action =
              onClickRecipient && actionType ? (
                <IconButton
                  aria-label={
                    actionType === "add" ? "Add recipient" : "Remove recipient"
                  }
                  variant="ghost"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickRecipient(recipient.id);
                  }}
                >
                  {actionType === "add" ? "+" : "-"}
                </IconButton>
              ) : undefined;

            return (
              <RecipientItem
                key={recipient.id}
                email={recipient.email}
                recipientId={recipient.id}
                onClick={
                  onClickRecipient
                    ? () => onClickRecipient(recipient.id)
                    : undefined
                }
                action={action}
                searchString={searchString}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};
