/**
 * Utility functions for recipient-related operations
 */

/**
 * Extract domain from email address
 */
export const extractDomain = (email: string): string => {
  return email.split("@")[1] || "";
};

/**
 * Pure function that creates an updater function to toggle an item in a Set<string>
 * @param item - The item to toggle in the set
 * @returns An updater function that takes the previous Set and returns a new Set with the item toggled
 */
export const toggleSetItem = (item: string) => {
  return (prev: Set<string>): Set<string> => {
    const next = new Set(prev);
    next.has(item) ? next.delete(item) : next.add(item);
    return next;
  };
};

