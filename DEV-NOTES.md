# Development Notes

## Introduction

### Libraries and Dependencies

The application is built with the following key libraries:

- **React 18.2.0** - Core UI framework
- **TypeScript 4.9.5** - Type safety and developer experience
- **Jotai 2.15.1** - Atomic state management library. Chosen for its lightweight, composable approach to state management that works well with React's concurrent features. Atoms provide fine-grained reactivity and eliminate prop drilling.
- **@tanstack/react-query 5.90.11** - Data fetching and caching. Used to handle the initial data loading lifecycle (loading, error, success states) for the recipients data pipeline.
- **@chakra-ui/react 3.30.0** - Component library for consistent UI design and styling. Provides accessible, customizable components out of the box.
- **@playwright/test 1.57.0** - End-to-end testing framework for comprehensive user flow validation
- **uuid 13.0.0** - Generates unique identifiers for recipients during data transformation

## App Organization

### Component Architecture

The application follows a clear separation between **container components** (that handle logic and state) and **presentational components** (that are reusable and configurable).

#### Container Components

Container components are responsible for:
- Connecting to state (atoms)
- Managing local UI state (expanded groups, search strings)
- Configuring action handlers
- Composing reusable components with specific behaviors

**Containers:**
- `App.tsx` - Root component that handles data loading lifecycle and renders appropriate state components
- `RecipientsManager.tsx` - Layout container that arranges the two panels side-by-side
- `AvailableRecipientsPanel.tsx` - Container for available recipients, configures selection actions
- `SelectedRecipientsPanel.tsx` - Container for selected recipients, configures removal actions

#### Reusable Components

Reusable components are pure, configurable UI components that accept props for behavior:

**Shared Components:**
- `RecipientList.tsx` - Generic list component that renders groups and individual recipients. Accepts configurable action handlers (`onClickDomain`, `onClickRecipient`) making it reusable for both panels
- `RecipientGroup.tsx` - Renders a collapsible domain group with its recipients
- `RecipientItem.tsx` - Renders a single recipient item
- `SearchBar.tsx` - Reusable search input component
- `LoadingState.tsx`, `ErrorState.tsx`, `EmptyState.tsx` - State-specific UI components

This architecture allows the same `RecipientList`, `RecipientGroup`, and `RecipientItem` components to be used in both panels, with different action handlers passed as props.

### Data Pipeline

The `data-pipeline/` directory contains a modular data processing system:

- **transform.ts** - Transforms raw recipient data into a normalized structure
- **normalize.ts** - Normalizes recipients, assigns unique IDs, and initializes state
- **memoize.ts** - Derived atoms that compute grouped and filtered recipient lists with memoization
- **pipeline.ts** - Orchestrates the data transformation pipeline and initializes Jotai store

The pipeline processes raw JSON data, transforms it, normalizes it, and populates the initial state atoms.

## State Organization

State management is built on **Jotai atoms** with a clear separation of concerns:

### Base Atoms (`store/atoms.ts`)

- `recipientsByIdAtom` - Lookup map of all recipients by ID
- `availableRecipientIdsAtom` - Array of recipient IDs in the available panel
- `selectedRecipientIdsAtom` - Array of recipient IDs in the selected panel
- `availableSearchStringAtom` / `selectedSearchStringAtom` - Search query strings for each panel
- `availableExpandedGroupsAtom` / `selectedExpandedGroupsAtom` - Sets of expanded domain groups (with auto-expansion on search)

### Derived Atoms (`data-pipeline/memoize.ts`)

Computed atoms that derive grouped and filtered lists from base atoms:
- `availableRecipientGroupsAtom` - Groups available recipients by domain, filtered by search
- `availableRecipientGroupsOnlyAtom` - Only domains with 2+ recipients
- `individualAvailableRecipientsAtom` - Recipients from domains with single recipient
- Similar atoms for selected recipients

### Action Atoms (`store/actions.ts`)

Write-only atoms that encapsulate state mutations:
- `selectRecipientActionAtom` - Moves a recipient from available to selected
- `selectDomainRecipientsActionAtom` - Moves all recipients from a domain
- `removeRecipientActionAtom` - Moves a recipient from selected to available
- `removeDomainRecipientsActionAtom` - Moves all recipients from a domain

This architecture provides:
- **Single source of truth** - All state in atoms
- **Automatic reactivity** - Components re-render when dependent atoms change
- **Composability** - Derived atoms build on base atoms
- **Performance** - Memoization prevents unnecessary recalculations

## Features Implemented

1. **Dual-panel Recipient Management**
   - Available recipients panel (left) and selected recipients panel (right)
   - Two-column responsive grid layout

2. **Domain-based Grouping**
   - Recipients automatically grouped by email domain
   - Domains with 2+ recipients shown as collapsible groups
   - Domains with 1 recipient shown as individual items

3. **Selection Actions**
   - Select individual recipients
   - Select entire domain groups (all recipients from a domain)
   - Visual feedback on interactions

4. **Removal Actions**
   - Remove individual recipients from selected list
   - Remove entire domain groups from selected list
   - Recipients return to available panel when removed

5. **Search Functionality**
   - Independent search in both panels
   - Filter by domain name (partial match, case-insensitive)
   - Filter by email address (partial match, case-insensitive)
   - Auto-expands matching domain groups during search

6. **Data Loading States**
   - Loading state during initial data fetch
   - Error state for failed data loading
   - Empty state when no recipients available

7. **Data Pipeline**
   - Transform raw JSON data into normalized structure
   - Assign unique IDs to recipients
   - Initialize application state from processed data

8. **End-to-End Testing**
   - Comprehensive Playwright tests covering all user flows
   - Tests for selection, removal, search, and grouping behaviors

## Things Improved

### UX Issue: Unnecessary Grouping Levels in Selected Recipients Panel

#### Problem

The original design mockup (`src/assets/wireframe.png`) introduced an unnecessary complication in the selected recipients panel by adding two wrapper grouping levels:
- "company recipients" (for domains with 2+ recipients)
- "email recipients" (for domains with 1 recipient)

This creates a confusing UX because:
1. **Redundant nesting**: Users must expand "company recipients" or "email recipients" first, then expand the actual domain groups (e.g., "timescale.com") to see individual emails. This is an extra click and cognitive step.
2. **Inconsistent structure**: The available recipients panel groups directly by domain, which is the natural and intuitive grouping. The selected panel should mirror this structure for consistency.
3. **Artificial categorization**: The distinction between "company" and "email" recipients is arbitrary and doesn't add value - users care about domains, not whether a domain has 1 or 2+ recipients.

#### Solution

Remove the unnecessary wrapper levels and use the same domain-based grouping structure as the available recipients panel:
- Group recipients by domain (domains with 2+ recipients shown as collapsible groups)
- Show individual recipients (from domains with only 1 recipient) directly in the list
- This creates a consistent, intuitive experience across both panels

#### Implementation

The refactoring makes the available recipient components reusable for both panels, accepting configurable action props (select vs remove) to handle the different behaviors needed in each context.

### Search Consistency Across Panels

#### Design Decision

Both the available and selected recipient panels should have search functionality to provide consistent behavior and UX. Users can filter recipients by:
- Company domain names (e.g., "timescale" matches "timescale.com")
- Email addresses (partial match, case-insensitive)

#### Implementation Approach

Instead of providing a separate autocomplete component, the search filters the existing recipient lists. This allows users to interact with the same familiar elements (groups, individual recipients) in a known manner, maintaining consistency with the rest of the UI. The search is implemented at the derived atom level for optimal performance, filtering groups and recipients before they reach the UI components.
