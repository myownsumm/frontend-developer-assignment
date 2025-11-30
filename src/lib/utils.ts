export const extractDomain = (email: string): string => {
  return email.split("@")[1] || "";
};

export const toggleSetItem = (item: string) => {
  return (prev: Set<string>): Set<string> => {
    const next = new Set(prev);
    next.has(item) ? next.delete(item) : next.add(item);
    return next;
  };
};

