import { createStore } from "jotai";
import { RawRecipient } from "./transform";
import { transformRecipients } from "./transform";
import { normalizeRecipients } from "./normalize";
import {
  recipientsByIdAtom,
  availableRecipientIdsAtom,
  selectedRecipientIdsAtom,
} from "../lib/atoms";

/**
 * Pipeline orchestrator: Executes the complete data pipeline.
 *
 * Pipeline stages:
 * 1. Transform: Assign UUIDs to raw recipients
 * 2. Normalize: Restructure into normalized form (byId, availableIds, selectedIds)
 * 3. Store: Update Jotai atoms with normalized data
 *
 * @param rawRecipients - Raw recipient data from source
 * @param store - Jotai store instance for updating atoms
 */
export const runRecipientsPipeline = (
  rawRecipients: RawRecipient[],
  store: ReturnType<typeof createStore>
): void => {
  // Stage 1: Transform - assign IDs
  const transformed = transformRecipients(rawRecipients);

  // Stage 2: Normalize - restructure into canonical form
  const normalized = normalizeRecipients(transformed);

  // Stage 3: Store - update atoms
  store.set(recipientsByIdAtom, normalized.recipientsById);
  store.set(availableRecipientIdsAtom, normalized.availableRecipientIds);
  store.set(selectedRecipientIdsAtom, normalized.selectedRecipientIds);
};

