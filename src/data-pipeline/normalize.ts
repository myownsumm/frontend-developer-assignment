import { Recipient } from "../types/recipients";
import { TransformedRecipient } from "./transform";

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

  const sortIdsByEmail = (ids: string[]): string[] => {
    return ids.sort((idA, idB) => {
      const emailA = recipientsById[idA]?.email ?? "";
      const emailB = recipientsById[idB]?.email ?? "";
      return emailA.localeCompare(emailB);
    });
  };

  return {
    recipientsById,
    availableRecipientIds: sortIdsByEmail(availableRecipientIds),
    selectedRecipientIds: sortIdsByEmail(selectedRecipientIds),
  };
};

