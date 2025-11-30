import { v4 as uuidv4 } from "uuid";

export interface RawRecipient {
  email: string;
  isSelected: boolean;
}

export interface TransformedRecipient {
  id: string;
  email: string;
  isSelected: boolean;
}

export const transformRecipients = (
  rawRecipients: RawRecipient[]
): TransformedRecipient[] => {
  return rawRecipients.map((rawRecipient) => ({
    id: uuidv4(),
    email: rawRecipient.email,
    isSelected: rawRecipient.isSelected,
  }));
};

