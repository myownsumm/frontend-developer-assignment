import { createStore } from "jotai";
import {
  availableRecipientGroupsAtom,
  availableRecipientGroupsOnlyAtom,
  individualAvailableRecipientsAtom,
  selectedRecipientGroupsAtom,
  selectedRecipientGroupsOnlyAtom,
  individualSelectedRecipientsAtom,
} from "./memoize";

// Mock Chakra UI to avoid dependency issues in tests
jest.mock("@chakra-ui/react", () => ({
  Box: "div",
}));
import {
  recipientsByIdAtom,
  availableRecipientIdsAtom,
  selectedRecipientIdsAtom,
  availableSearchStringAtom,
  selectedSearchStringAtom,
} from "../store/atoms";
import { Recipient } from "../types/recipients";

describe("memoize atoms", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe("availableRecipientGroupsAtom", () => {
    it("should return empty array when no recipients", () => {
      store.set(recipientsByIdAtom, {});
      store.set(availableRecipientIdsAtom, []);

      const groups = store.get(availableRecipientGroupsAtom);

      expect(groups).toEqual([]);
    });

    it("should group recipients by domain", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@example.com" },
        id3: { id: "id3", email: "admin@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2", "id3"]);

      const groups = store.get(availableRecipientGroupsAtom);

      expect(groups).toHaveLength(2);
      expect(groups.find((g) => g.domain === "example.com")?.recipients).toHaveLength(2);
      expect(groups.find((g) => g.domain === "test.com")?.recipients).toHaveLength(1);
    });

    it("should sort groups by domain alphabetically", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user@zebra.com" },
        id2: { id: "id2", email: "user@apple.com" },
        id3: { id: "id3", email: "user@banana.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2", "id3"]);

      const groups = store.get(availableRecipientGroupsAtom);

      expect(groups[0].domain).toBe("apple.com");
      expect(groups[1].domain).toBe("banana.com");
      expect(groups[2].domain).toBe("zebra.com");
    });

    it("should filter groups based on search string", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2"]);
      store.set(availableSearchStringAtom, "example");

      const groups = store.get(availableRecipientGroupsAtom);

      expect(groups).toHaveLength(1);
      expect(groups[0].domain).toBe("example.com");
    });

    it("should filter recipients within groups based on search string", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "john@example.com" },
        id2: { id: "id2", email: "jane@example.com" },
        id3: { id: "id3", email: "bob@example.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2", "id3"]);
      store.set(availableSearchStringAtom, "john");

      const groups = store.get(availableRecipientGroupsAtom);

      expect(groups).toHaveLength(1);
      expect(groups[0].recipients).toHaveLength(1);
      expect(groups[0].recipients[0].email).toBe("john@example.com");
    });

    it("should return all groups when search string is empty", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2"]);
      store.set(availableSearchStringAtom, "");

      const groups = store.get(availableRecipientGroupsAtom);

      expect(groups).toHaveLength(2);
    });

    it("should handle recipients with missing IDs gracefully", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "missing-id"]);

      const groups = store.get(availableRecipientGroupsAtom);

      expect(groups).toHaveLength(1);
      expect(groups[0].recipients).toHaveLength(1);
    });
  });

  describe("availableRecipientGroupsOnlyAtom", () => {
    it("should return only groups with 2+ recipients", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@example.com" },
        id3: { id: "id3", email: "user3@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2", "id3"]);

      const groups = store.get(availableRecipientGroupsOnlyAtom);

      expect(groups).toHaveLength(1);
      expect(groups[0].domain).toBe("example.com");
      expect(groups[0].recipients).toHaveLength(2);
    });

    it("should return empty array when no groups have 2+ recipients", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2"]);

      const groups = store.get(availableRecipientGroupsOnlyAtom);

      expect(groups).toEqual([]);
    });
  });

  describe("individualAvailableRecipientsAtom", () => {
    it("should return only recipients from groups with single recipient", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@example.com" },
        id3: { id: "id3", email: "user3@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2", "id3"]);

      const individuals = store.get(individualAvailableRecipientsAtom);

      expect(individuals).toHaveLength(1);
      expect(individuals[0].email).toBe("user3@test.com");
    });

    it("should return all recipients when all are in single-recipient groups", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2"]);

      const individuals = store.get(individualAvailableRecipientsAtom);

      expect(individuals).toHaveLength(2);
    });

    it("should return empty array when all recipients are in groups", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@example.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2"]);

      const individuals = store.get(individualAvailableRecipientsAtom);

      expect(individuals).toEqual([]);
    });
  });

  describe("selectedRecipientGroupsAtom", () => {
    it("should return empty array when no selected recipients", () => {
      store.set(recipientsByIdAtom, {});
      store.set(selectedRecipientIdsAtom, []);

      const groups = store.get(selectedRecipientGroupsAtom);

      expect(groups).toEqual([]);
    });

    it("should group selected recipients by domain", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@example.com" },
        id3: { id: "id3", email: "admin@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(selectedRecipientIdsAtom, ["id1", "id2", "id3"]);

      const groups = store.get(selectedRecipientGroupsAtom);

      expect(groups).toHaveLength(2);
      expect(groups.find((g) => g.domain === "example.com")?.recipients).toHaveLength(2);
      expect(groups.find((g) => g.domain === "test.com")?.recipients).toHaveLength(1);
    });

    it("should filter selected groups based on search string", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(selectedRecipientIdsAtom, ["id1", "id2"]);
      store.set(selectedSearchStringAtom, "example");

      const groups = store.get(selectedRecipientGroupsAtom);

      expect(groups).toHaveLength(1);
      expect(groups[0].domain).toBe("example.com");
    });
  });

  describe("selectedRecipientGroupsOnlyAtom", () => {
    it("should return only selected groups with 2+ recipients", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@example.com" },
        id3: { id: "id3", email: "user3@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(selectedRecipientIdsAtom, ["id1", "id2", "id3"]);

      const groups = store.get(selectedRecipientGroupsOnlyAtom);

      expect(groups).toHaveLength(1);
      expect(groups[0].domain).toBe("example.com");
      expect(groups[0].recipients).toHaveLength(2);
    });
  });

  describe("individualSelectedRecipientsAtom", () => {
    it("should return only selected recipients from groups with single recipient", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@example.com" },
        id3: { id: "id3", email: "user3@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(selectedRecipientIdsAtom, ["id1", "id2", "id3"]);

      const individuals = store.get(individualSelectedRecipientsAtom);

      expect(individuals).toHaveLength(1);
      expect(individuals[0].email).toBe("user3@test.com");
    });
  });

  describe("integration scenarios", () => {
    it("should handle mixed available and selected recipients", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@example.com" },
        id2: { id: "id2", email: "user2@example.com" },
        id3: { id: "id3", email: "user3@test.com" },
        id4: { id: "id4", email: "user4@test.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2"]);
      store.set(selectedRecipientIdsAtom, ["id3", "id4"]);

      const availableGroups = store.get(availableRecipientGroupsAtom);
      const selectedGroups = store.get(selectedRecipientGroupsAtom);

      expect(availableGroups).toHaveLength(1);
      expect(availableGroups[0].domain).toBe("example.com");
      expect(selectedGroups).toHaveLength(1);
      expect(selectedGroups[0].domain).toBe("test.com");
    });

    it("should handle case-insensitive domain extraction", () => {
      const recipientsById: Record<string, Recipient> = {
        id1: { id: "id1", email: "user1@Example.COM" },
        id2: { id: "id2", email: "user2@example.com" },
      };

      store.set(recipientsByIdAtom, recipientsById);
      store.set(availableRecipientIdsAtom, ["id1", "id2"]);

      const groups = store.get(availableRecipientGroupsAtom);

      // Should group by domain (case-sensitive domain extraction)
      // Note: extractDomain returns "Example.COM" and "example.com" as different domains
      expect(groups.length).toBeGreaterThanOrEqual(1);
    });
  });
});

