import { atom } from "jotai";
import { Recipient, RecipientGroup } from "../types/recipients";
import {
  recipientsByIdAtom,
  availableRecipientIdsAtom,
  selectedRecipientIdsAtom,
  availableSearchStringAtom,
  selectedSearchStringAtom,
} from "../lib/atoms";
import { filterRecipientGroups } from "../lib/search";

/**
 * Memoize stage: Create memoized/derived values for performance optimization.
 *
 * This stage is for computed/derived values that need caching, such as:
 * - Grouped recipients by domain
 * - Filtered/sorted lists
 * - Aggregated statistics
 */

/**
 * Extract domain from email address
 */
const extractDomain = (email: string): string => {
  return email.split("@")[1] || "";
};

/**
 * Derived atom: Groups available recipients by domain.
 * Recipients with the same domain are grouped together.
 * Filters results based on search string if provided.
 */
export const availableRecipientGroupsAtom = atom<RecipientGroup[]>((get) => {
  const recipientsById = get(recipientsByIdAtom);
  const availableIds = get(availableRecipientIdsAtom);
  const searchString = get(availableSearchStringAtom);

  // Get available recipients
  const availableRecipients = availableIds
    .map((id) => recipientsById[id])
    .filter((recipient): recipient is Recipient => recipient !== undefined);

  // Group by domain
  const domainMap = new Map<string, Recipient[]>();

  availableRecipients.forEach((recipient) => {
    const domain = extractDomain(recipient.email);
    if (!domainMap.has(domain)) {
      domainMap.set(domain, []);
    }
    domainMap.get(domain)!.push(recipient);
  });

  // Convert to RecipientGroup array, sorted by domain
  const groups: RecipientGroup[] = Array.from(domainMap.entries())
    .map(([domain, recipients]) => ({
      domain,
      recipients,
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain));

  // Filter groups based on search string
  return filterRecipientGroups(groups, searchString);
});

/**
 * Derived atom: Available recipients grouped by domain (groups with 2+ recipients)
 */
export const availableRecipientGroupsOnlyAtom = atom<RecipientGroup[]>(
  (get) => {
    const groups = get(availableRecipientGroupsAtom);
    return groups.filter((group) => group.recipients.length > 1);
  }
);

/**
 * Derived atom: Individual available recipients (domains with only 1 recipient)
 */
export const individualAvailableRecipientsAtom = atom<Recipient[]>((get) => {
  const groups = get(availableRecipientGroupsAtom);
  return groups
    .filter((group) => group.recipients.length === 1)
    .flatMap((group) => group.recipients);
});

/**
 * Derived atom: Groups selected recipients by domain.
 * Recipients with the same domain are grouped together.
 * Filters results based on search string if provided.
 */
export const selectedRecipientGroupsAtom = atom<RecipientGroup[]>((get) => {
  const recipientsById = get(recipientsByIdAtom);
  const selectedIds = get(selectedRecipientIdsAtom);
  const searchString = get(selectedSearchStringAtom);

  // Get selected recipients
  const selectedRecipients = selectedIds
    .map((id) => recipientsById[id])
    .filter((recipient): recipient is Recipient => recipient !== undefined);

  // Group by domain
  const domainMap = new Map<string, Recipient[]>();

  selectedRecipients.forEach((recipient) => {
    const domain = extractDomain(recipient.email);
    if (!domainMap.has(domain)) {
      domainMap.set(domain, []);
    }
    domainMap.get(domain)!.push(recipient);
  });

  // Convert to RecipientGroup array, sorted by domain
  const groups: RecipientGroup[] = Array.from(domainMap.entries())
    .map(([domain, recipients]) => ({
      domain,
      recipients,
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain));

  // Filter groups based on search string
  return filterRecipientGroups(groups, searchString);
});


/**
 * Derived atom: Selected recipients grouped by domain (groups with 2+ recipients)
 */
export const selectedRecipientGroupsOnlyAtom = atom<RecipientGroup[]>(
  (get) => {
    const groups = get(selectedRecipientGroupsAtom);
    return groups.filter((group) => group.recipients.length > 1);
  }
);

/**
 * Derived atom: Individual selected recipients (domains with only 1 recipient)
 */
export const individualSelectedRecipientsAtom = atom<Recipient[]>((get) => {
  const groups = get(selectedRecipientGroupsAtom);
  return groups
    .filter((group) => group.recipients.length === 1)
    .flatMap((group) => group.recipients);
});
