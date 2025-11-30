# Development Notes

## UX Issue: Unnecessary Grouping Levels in Selected Recipients Panel

### Problem

The original design mockup (`src/assets/wireframe.png`) introduced an unnecessary complication in the selected recipients panel by adding two wrapper grouping levels:
- "company recipients" (for domains with 2+ recipients)
- "email recipients" (for domains with 1 recipient)

This creates a confusing UX because:
1. **Redundant nesting**: Users must expand "company recipients" or "email recipients" first, then expand the actual domain groups (e.g., "timescale.com") to see individual emails. This is an extra click and cognitive step.
2. **Inconsistent structure**: The available recipients panel groups directly by domain, which is the natural and intuitive grouping. The selected panel should mirror this structure for consistency.
3. **Artificial categorization**: The distinction between "company" and "email" recipients is arbitrary and doesn't add value - users care about domains, not whether a domain has 1 or 2+ recipients.

### Solution

Remove the unnecessary wrapper levels and use the same domain-based grouping structure as the available recipients panel:
- Group recipients by domain (domains with 2+ recipients shown as collapsible groups)
- Show individual recipients (from domains with only 1 recipient) directly in the list
- This creates a consistent, intuitive experience across both panels

### Implementation

The refactoring makes the available recipient components reusable for both panels, accepting configurable action props (select vs remove) to handle the different behaviors needed in each context.

