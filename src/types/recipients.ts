export interface Recipient {
  id: string;
  email: string;
}

export interface RecipientGroup {
  domain: string;
  recipients: Recipient[];
}

export interface AvailableRecipientItemProps {
  email: string;
  recipientId: string;
  onClick?: () => void;
}

export interface AvailableRecipientGroupProps {
  domain: string;
  recipients: Recipient[];
  isExpanded?: boolean;
  onToggle?: () => void;
  onSelectDomain?: () => void;
  onSelectRecipient?: (recipientId: string) => void;
}

export interface AvailableRecipientListProps {
  groups: RecipientGroup[];
  individualRecipients: Recipient[];
}

export interface SearchBarProps {
  placeholder?: string;
}

export interface AvailableRecipientsPanelProps {
  groups: RecipientGroup[];
  individualRecipients: Recipient[];
}

export interface SelectedRecipientItemProps {
  email: string;
  recipientId: string;
  onClick?: () => void;
}

export interface SelectedRecipientGroupProps {
  groupName: string;
  recipients: Recipient[];
  isExpanded?: boolean;
  onToggle?: () => void;
  onRemoveDomain?: () => void;
  onRemoveRecipient?: (recipientId: string) => void;
}

export interface SelectedRecipientListProps {
  companyRecipients: Recipient[];
  emailRecipients: Recipient[];
}

export interface SelectedRecipientsPanelProps {
  companyRecipients: Recipient[];
  emailRecipients: Recipient[];
}

