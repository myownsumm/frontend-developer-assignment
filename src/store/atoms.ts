import { atom } from "jotai";
import { Recipient } from "../types/recipients";

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
 * Atom storing expanded group domains in available recipients panel
 */
export const availableExpandedGroupsAtom = atom<Set<string>>(new Set<string>());

/**
 * Atom storing expanded group domains in selected recipients panel
 */
export const selectedExpandedGroupsAtom = atom<Set<string>>(new Set<string>());

/**
 * Atom storing search string for filtering available recipients
 */
export const availableSearchStringAtom = atom<string>("");

/**
 * Atom storing search string for filtering selected recipients
 */
export const selectedSearchStringAtom = atom<string>("");


