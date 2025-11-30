import { Recipient, RecipientGroup } from "../types/recipients";

/**
 * Extract domain from email address
 */
const extractDomain = (email: string): string => {
  return email.split("@")[1] || "";
};

/**
 * Check if a recipient matches the search string.
 * Matches are case-insensitive and check both:
 * - Email address (partial match)
 * - Domain name (partial match)
 */
export const matchesSearch = (recipient: Recipient, searchString: string): boolean => {
  if (!searchString.trim()) {
    return true;
  }

  const lowerSearch = searchString.toLowerCase();
  const lowerEmail = recipient.email.toLowerCase();
  const domain = extractDomain(recipient.email);
  const lowerDomain = domain.toLowerCase();

  return lowerEmail.includes(lowerSearch) || lowerDomain.includes(lowerSearch);
};

/**
 * Filter recipient groups based on search string.
 * - Filters groups where domain matches
 * - Filters recipients within groups where email matches
 * - Returns groups with at least one matching recipient
 */
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

      // Filter recipients within the group
      const matchingRecipients = group.recipients.filter((recipient) =>
        matchesSearch(recipient, searchString)
      );

      // Include group if domain matches or if any recipient matches
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

