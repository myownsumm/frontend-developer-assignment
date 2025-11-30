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
  value: string;
  onChange: (value: string) => void;
}

// Shared component types for reusable recipient components
export interface RecipientItemProps {
  email: string;
  recipientId: string;
  onClick?: () => void;
  action?: React.ReactNode;
  searchString?: string;
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
  searchString?: string;
}

export interface RecipientListProps {
  groups: RecipientGroup[];
  individualRecipients: Recipient[];
  expandedGroups: Set<string>;
  onToggleGroup: (domain: string) => void;
  onClickDomain?: (domain: string) => void;
  onClickRecipient?: (recipientId: string) => void;
  actionType?: 'add' | 'remove';
  searchString?: string;
}

