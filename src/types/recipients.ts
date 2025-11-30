export interface Recipient {
  id: string;
  email: string;
}

export interface RecipientGroup {
  domain: string;
  recipients: Recipient[];
}

export interface SearchBarProps {
  placeholder?: string;
}

// Shared component types for reusable recipient components
export interface RecipientItemProps {
  email: string;
  recipientId: string;
  onClick?: () => void;
  action?: React.ReactNode;
}

export interface RecipientGroupProps {
  domain: string;
  recipients: Recipient[];
  isExpanded?: boolean;
  onToggle?: () => void;
  onClickDomain?: () => void;
  onClickRecipient?: (recipientId: string) => void;
  actionType?: 'add' | 'remove';
  showDomainRemoveButton?: boolean;
}

export interface RecipientListProps {
  groups: RecipientGroup[];
  individualRecipients: Recipient[];
  expandedGroups: Set<string>;
  onToggleGroup: (domain: string) => void;
  onClickDomain?: (domain: string) => void;
  onClickRecipient?: (recipientId: string) => void;
  actionType?: 'add' | 'remove';
}

