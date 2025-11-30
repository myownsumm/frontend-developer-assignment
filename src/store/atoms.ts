import { atom } from "jotai";
import { Recipient } from "../types/recipients";
import { extractDomain } from "../lib/utils";

/**
 * Atom storing all recipients by ID (normalized data structure)
 */
export const recipientsByIdAtom = atom<Record<string, Recipient>>({});

/**
 * Atom storing IDs of available recipients
 */
export const availableRecipientIdsAtom = atom<string[]>([]);

/**
 * Atom storing IDs of selected recipients
 */
export const selectedRecipientIdsAtom = atom<string[]>([]);

/**
 * Atom storing search string for filtering available recipients
 */
export const availableSearchStringAtom = atom<string>("");

/**
 * Atom storing search string for filtering selected recipients
 */
export const selectedSearchStringAtom = atom<string>("");

const createAutoExpandedGroupsAtom = (
  idsAtom: typeof availableRecipientIdsAtom,
  searchAtom: typeof availableSearchStringAtom
) => {
  const manualAtom = atom<Set<string>>(new Set<string>());

  return atom(
    (get): Set<string> => {
      const searchString = get(searchAtom).trim().toLowerCase();
      const manual = get(manualAtom);

      if (!searchString) {
        return manual;
      }

      const recipientsById = get(recipientsByIdAtom);
      const ids = get(idsAtom);

      const domainCounts = new Map<string, number>();
      const matchingDomains = new Set<string>();

      ids.forEach((id) => {
        const recipient = recipientsById[id];
        if (!recipient) {
          return;
        }

        const domain = extractDomain(recipient.email);
        domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);

        if (recipient.email.toLowerCase().includes(searchString)) {
          matchingDomains.add(domain);
        }
      });

      if (matchingDomains.size === 0) {
        return manual;
      }

      const autoExpanded = new Set(manual);
      matchingDomains.forEach((domain) => {
        if ((domainCounts.get(domain) ?? 0) > 1) {
          autoExpanded.add(domain);
        }
      });

      return autoExpanded;
    },
    (
      get,
      set,
      update: Set<string> | ((prev: Set<string>) => Set<string>)
    ) => {
      const current = get(manualAtom);
      const next =
        typeof update === "function" ? update(current) : update;
      set(manualAtom, next);
    }
  );
};

/**
 * Atom storing expanded group domains in available recipients panel
 */
export const availableExpandedGroupsAtom = createAutoExpandedGroupsAtom(
  availableRecipientIdsAtom,
  availableSearchStringAtom
);

/**
 * Atom storing expanded group domains in selected recipients panel
 */
export const selectedExpandedGroupsAtom = createAutoExpandedGroupsAtom(
  selectedRecipientIdsAtom,
  selectedSearchStringAtom
);
