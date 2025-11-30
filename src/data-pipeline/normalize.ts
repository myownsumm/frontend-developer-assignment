import { Recipient } from "../types/recipients";
import { TransformedRecipient } from "./transform";

/**
 * Normalize stage: Remove isSelected property and separate into available/selected IDs.
 * Restructures data model into canonical normalized form.
 */
export const normalizeRecipients = (
  transformedRecipients: TransformedRecipient[]
): {
  recipientsById: Record<string, Recipient>;
  availableRecipientIds: string[];
  selectedRecipientIds: string[];
} => {
  const recipientsById: Record<string, Recipient> = {};
  const availableRecipientIds: string[] = [];
  const selectedRecipientIds: string[] = [];

  transformedRecipients.forEach((transformedRecipient) => {
    const recipient: Recipient = {
      id: transformedRecipient.id,
      email: transformedRecipient.email,
    };

    recipientsById[transformedRecipient.id] = recipient;

    if (transformedRecipient.isSelected) {
      selectedRecipientIds.push(transformedRecipient.id);
    } else {
      availableRecipientIds.push(transformedRecipient.id);
    }
  });

  return {
    recipientsById,
    availableRecipientIds,
    selectedRecipientIds,
  };
};

