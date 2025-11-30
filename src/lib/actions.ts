import { atom } from "jotai";
import {
  recipientsByIdAtom,
  availableRecipientIdsAtom,
  selectedRecipientIdsAtom,
} from "./atoms";

/**
 * Extract domain from email address
 */
const extractDomain = (email: string): string => {
  return email.split("@")[1] || "";
};

/**
 * Write atom: Select a single recipient by ID
 * Moves recipient from available to selected
 */
export const selectRecipientActionAtom = atom(
  null,
  (get, set, recipientId: string) => {
    const availableIds = get(availableRecipientIdsAtom);
    const selectedIds = get(selectedRecipientIdsAtom);

    // Remove from available, add to selected
    set(availableRecipientIdsAtom, availableIds.filter((id) => id !== recipientId));
    set(selectedRecipientIdsAtom, [...selectedIds, recipientId]);
  }
);

/**
 * Write atom: Select all recipients with a given domain
 * Moves all recipients with the domain from available to selected
 */
export const selectDomainRecipientsActionAtom = atom(
  null,
  (get, set, domain: string) => {
    const recipientsById = get(recipientsByIdAtom);
    const availableIds = get(availableRecipientIdsAtom);
    const selectedIds = get(selectedRecipientIdsAtom);

    // Find all available recipient IDs with the given domain
    const domainRecipientIds = availableIds.filter((id) => {
      const recipient = recipientsById[id];
      return recipient && extractDomain(recipient.email) === domain;
    });

    // Remove from available, add to selected
    set(
      availableRecipientIdsAtom,
      availableIds.filter((id) => !domainRecipientIds.includes(id))
    );
    set(selectedRecipientIdsAtom, [...selectedIds, ...domainRecipientIds]);
  }
);

/**
 * Write atom: Remove a single recipient by ID
 * Moves recipient from selected back to available
 */
export const removeRecipientActionAtom = atom(
  null,
  (get, set, recipientId: string) => {
    const availableIds = get(availableRecipientIdsAtom);
    const selectedIds = get(selectedRecipientIdsAtom);

    // Remove from selected, add back to available
    set(selectedRecipientIdsAtom, selectedIds.filter((id) => id !== recipientId));
    set(availableRecipientIdsAtom, [...availableIds, recipientId]);
  }
);

/**
 * Write atom: Remove all recipients with a given domain
 * Moves all recipients with the domain from selected back to available
 */
export const removeDomainRecipientsActionAtom = atom(
  null,
  (get, set, domain: string) => {
    const recipientsById = get(recipientsByIdAtom);
    const availableIds = get(availableRecipientIdsAtom);
    const selectedIds = get(selectedRecipientIdsAtom);

    // Find all selected recipient IDs with the given domain
    const domainRecipientIds = selectedIds.filter((id) => {
      const recipient = recipientsById[id];
      return recipient && extractDomain(recipient.email) === domain;
    });

    // Remove from selected, add back to available
    set(
      selectedRecipientIdsAtom,
      selectedIds.filter((id) => !domainRecipientIds.includes(id))
    );
    set(availableRecipientIdsAtom, [...availableIds, ...domainRecipientIds]);
  }
);

