import { atom } from "jotai";
import {
  recipientsByIdAtom,
  availableRecipientIdsAtom,
  selectedRecipientIdsAtom,
} from "./atoms";
import { extractDomain } from "../lib/utils";

export const selectRecipientActionAtom = atom(
  null,
  (get, set, recipientId: string) => {
    const availableIds = get(availableRecipientIdsAtom);
    const selectedIds = get(selectedRecipientIdsAtom);

    set(availableRecipientIdsAtom, availableIds.filter((id) => id !== recipientId));
    set(selectedRecipientIdsAtom, [...selectedIds, recipientId]);
  }
);

export const selectDomainRecipientsActionAtom = atom(
  null,
  (get, set, domain: string) => {
    const recipientsById = get(recipientsByIdAtom);
    const availableIds = get(availableRecipientIdsAtom);
    const selectedIds = get(selectedRecipientIdsAtom);

    const domainRecipientIds = availableIds.filter((id) => {
      const recipient = recipientsById[id];
      return recipient && extractDomain(recipient.email) === domain;
    });

    set(
      availableRecipientIdsAtom,
      availableIds.filter((id) => !domainRecipientIds.includes(id))
    );
    set(selectedRecipientIdsAtom, [...selectedIds, ...domainRecipientIds]);
  }
);

export const removeRecipientActionAtom = atom(
  null,
  (get, set, recipientId: string) => {
    const availableIds = get(availableRecipientIdsAtom);
    const selectedIds = get(selectedRecipientIdsAtom);

    set(selectedRecipientIdsAtom, selectedIds.filter((id) => id !== recipientId));
    set(availableRecipientIdsAtom, [...availableIds, recipientId]);
  }
);

export const removeDomainRecipientsActionAtom = atom(
  null,
  (get, set, domain: string) => {
    const recipientsById = get(recipientsByIdAtom);
    const availableIds = get(availableRecipientIdsAtom);
    const selectedIds = get(selectedRecipientIdsAtom);

    const domainRecipientIds = selectedIds.filter((id) => {
      const recipient = recipientsById[id];
      return recipient && extractDomain(recipient.email) === domain;
    });

    set(
      selectedRecipientIdsAtom,
      selectedIds.filter((id) => !domainRecipientIds.includes(id))
    );
    set(availableRecipientIdsAtom, [...availableIds, ...domainRecipientIds]);
  }
);


