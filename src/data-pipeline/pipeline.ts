import { createStore } from "jotai";
import { RawRecipient } from "./transform";
import { transformRecipients } from "./transform";
import { normalizeRecipients } from "./normalize";
import {
  recipientsByIdAtom,
  availableRecipientIdsAtom,
  selectedRecipientIdsAtom,
} from "../store/atoms";
import { Recipient } from "../types/recipients";

export type RecipientsData = {
  recipientsById: Record<string, Recipient>;
  availableRecipientIds: string[];
  selectedRecipientIds: string[];
};

export const runRecipientsPipeline = (
  rawRecipients: RawRecipient[],
  store: ReturnType<typeof createStore>
): RecipientsData => {
  const transformed = transformRecipients(rawRecipients);
  const normalized = normalizeRecipients(transformed);

  store.set(recipientsByIdAtom, normalized.recipientsById);
  store.set(availableRecipientIdsAtom, normalized.availableRecipientIds);
  store.set(selectedRecipientIdsAtom, normalized.selectedRecipientIds);

  return normalized;
};
