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

/**
 * Pipeline orchestrator: Executes the complete data pipeline.
 * Returns the normalized data structure and updates store atoms.
 */
export const runRecipientsPipeline = (
  rawRecipients: RawRecipient[],
  store: ReturnType<typeof createStore>
): RecipientsData => {
  // Stage 1: Transform - assign IDs
  const transformed = transformRecipients(rawRecipients);

  // Stage 2: Normalize - restructure into canonical form
  const normalized = normalizeRecipients(transformed);

  // Stage 3: Store - update atoms
  store.set(recipientsByIdAtom, normalized.recipientsById);
  store.set(availableRecipientIdsAtom, normalized.availableRecipientIds);
  store.set(selectedRecipientIdsAtom, normalized.selectedRecipientIds);

  // Return normalized data for consumers (e.g., react-query)
  return normalized;
};
