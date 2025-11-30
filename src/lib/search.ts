import { Recipient, RecipientGroup } from "../types/recipients";
import React from "react";
import { Box } from "@chakra-ui/react";
import { extractDomain } from "./utils";

export const matchesSearch = (
  recipient: Recipient,
  searchString: string
): boolean => {
  if (!searchString.trim()) {
    return true;
  }

  const lowerSearch = searchString.toLowerCase();
  const lowerEmail = recipient.email.toLowerCase();
  const domain = extractDomain(recipient.email);
  const lowerDomain = domain.toLowerCase();

  return lowerEmail.includes(lowerSearch) || lowerDomain.includes(lowerSearch);
};

export const filterRecipientGroups = (
  groups: RecipientGroup[],
  searchString: string
): RecipientGroup[] => {
  if (!searchString.trim()) {
    return groups;
  }

  const lowerSearch = searchString.toLowerCase();

  return groups
    .map((group) => {
      const lowerDomain = group.domain.toLowerCase();
      const domainMatches = lowerDomain.includes(lowerSearch);

      const matchingRecipients = group.recipients.filter((recipient) =>
        matchesSearch(recipient, searchString)
      );

      if (domainMatches || matchingRecipients.length > 0) {
        return {
          ...group,
          recipients: domainMatches ? group.recipients : matchingRecipients,
        };
      }

      return null;
    })
    .filter((group): group is RecipientGroup => group !== null);
};

export const highlightMatch = (
  text: string,
  searchString: string
): React.ReactNode[] => {
  if (!searchString.trim()) {
    return [text];
  }

  const lowerText = text.toLowerCase();
  const lowerSearch = searchString.toLowerCase();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerSearch, lastIndex);

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push(text.substring(lastIndex, index));
    }

    parts.push(
      React.createElement(
        Box,
        {
          as: "span",
          key: `highlight-${index}`,
          bg: "yellow.200",
          fontWeight: "semibold",
          px: 0,
          borderRadius: "sm",
          display: "inline",
        },
        text.substring(index, index + searchString.length)
      )
    );

    lastIndex = index + searchString.length;
    index = lowerText.indexOf(lowerSearch, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};
