/**
 * Utility functions for recipient-related operations
 */

/**
 * Extract domain from email address
 */
export const extractDomain = (email: string): string => {
  return email.split("@")[1] || "";
};

