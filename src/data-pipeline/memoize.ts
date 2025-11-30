import { atom } from "jotai";
import { Recipient, RecipientGroup } from "../types/recipients";
import {
  recipientsByIdAtom,
  availableRecipientIdsAtom,
  selectedRecipientIdsAtom,
  availableSearchStringAtom,
  selectedSearchStringAtom,
} from "../store/atoms";
import { filterRecipientGroups } from "../lib/search";
import { extractDomain } from "../lib/utils";

export const availableRecipientGroupsAtom = atom<RecipientGroup[]>((get) => {
  const recipientsById = get(recipientsByIdAtom);
  const availableIds = get(availableRecipientIdsAtom);
  const searchString = get(availableSearchStringAtom);

  const availableRecipients = availableIds
    .map((id) => recipientsById[id])
    .filter((recipient): recipient is Recipient => recipient !== undefined);

  const domainMap = new Map<string, Recipient[]>();

  availableRecipients.forEach((recipient) => {
    const domain = extractDomain(recipient.email);
    if (!domainMap.has(domain)) {
      domainMap.set(domain, []);
    }
    domainMap.get(domain)!.push(recipient);
  });

  const groups: RecipientGroup[] = Array.from(domainMap.entries())
    .map(([domain, recipients]) => ({
      domain,
      recipients,
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain));

  return filterRecipientGroups(groups, searchString);
});

export const availableRecipientGroupsOnlyAtom = atom<RecipientGroup[]>(
  (get) => {
    const groups = get(availableRecipientGroupsAtom);
    return groups.filter((group) => group.recipients.length > 1);
  }
);

export const individualAvailableRecipientsAtom = atom<Recipient[]>((get) => {
  const groups = get(availableRecipientGroupsAtom);
  return groups
    .filter((group) => group.recipients.length === 1)
    .flatMap((group) => group.recipients);
});

export const selectedRecipientGroupsAtom = atom<RecipientGroup[]>((get) => {
  const recipientsById = get(recipientsByIdAtom);
  const selectedIds = get(selectedRecipientIdsAtom);
  const searchString = get(selectedSearchStringAtom);

  const selectedRecipients = selectedIds
    .map((id) => recipientsById[id])
    .filter((recipient): recipient is Recipient => recipient !== undefined);

  const domainMap = new Map<string, Recipient[]>();

  selectedRecipients.forEach((recipient) => {
    const domain = extractDomain(recipient.email);
    if (!domainMap.has(domain)) {
      domainMap.set(domain, []);
    }
    domainMap.get(domain)!.push(recipient);
  });

  const groups: RecipientGroup[] = Array.from(domainMap.entries())
    .map(([domain, recipients]) => ({
      domain,
      recipients,
    }))
    .sort((a, b) => a.domain.localeCompare(b.domain));

  return filterRecipientGroups(groups, searchString);
});


export const selectedRecipientGroupsOnlyAtom = atom<RecipientGroup[]>(
  (get) => {
    const groups = get(selectedRecipientGroupsAtom);
    return groups.filter((group) => group.recipients.length > 1);
  }
);

export const individualSelectedRecipientsAtom = atom<Recipient[]>((get) => {
  const groups = get(selectedRecipientGroupsAtom);
  return groups
    .filter((group) => group.recipients.length === 1)
    .flatMap((group) => group.recipients);
});
