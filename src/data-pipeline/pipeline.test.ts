// Mock uuid before imports
let mockUuidCounter = 0;
jest.mock("uuid", () => ({
  v4: () => {
    mockUuidCounter += 1;
    return `mock-uuid-${mockUuidCounter}`;
  },
}));

import { createStore } from "jotai";
import { runRecipientsPipeline } from "./pipeline";
import { RawRecipient } from "./transform";
import {
  recipientsByIdAtom,
  availableRecipientIdsAtom,
  selectedRecipientIdsAtom,
} from "../store/atoms";
import { Recipient } from "../types/recipients";

describe("runRecipientsPipeline", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
    // Reset UUID counter for each test
    mockUuidCounter = 0;
    jest.clearAllMocks();
  });

  it("should process empty array", () => {
    const rawRecipients: RawRecipient[] = [];

    runRecipientsPipeline(rawRecipients, store);

    expect(store.get(recipientsByIdAtom)).toEqual({});
    expect(store.get(availableRecipientIdsAtom)).toEqual([]);
    expect(store.get(selectedRecipientIdsAtom)).toEqual([]);
  });

  it("should transform and normalize recipients", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "user1@example.com", isSelected: false },
      { email: "user2@example.com", isSelected: true },
    ];

    runRecipientsPipeline(rawRecipients, store);

    const recipientsById = store.get(recipientsByIdAtom);
    const availableIds = store.get(availableRecipientIdsAtom);
    const selectedIds = store.get(selectedRecipientIdsAtom);

    expect(Object.keys(recipientsById)).toHaveLength(2);
    expect(availableIds).toHaveLength(1);
    expect(selectedIds).toHaveLength(1);

    // Verify recipients are stored correctly
    const recipient1 = Object.values(recipientsById).find(
      (r) => r.email === "user1@example.com"
    );
    const recipient2 = Object.values(recipientsById).find(
      (r) => r.email === "user2@example.com"
    );

    expect(recipient1).toBeDefined();
    expect(recipient2).toBeDefined();
    expect(recipient1?.id).toBeDefined();
    expect(recipient2?.id).toBeDefined();
  });

  it("should separate available and selected recipients", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "user1@example.com", isSelected: false },
      { email: "user2@example.com", isSelected: false },
      { email: "user3@example.com", isSelected: true },
      { email: "user4@example.com", isSelected: true },
    ];

    runRecipientsPipeline(rawRecipients, store);

    const availableIds = store.get(availableRecipientIdsAtom);
    const selectedIds = store.get(selectedRecipientIdsAtom);

    expect(availableIds).toHaveLength(2);
    expect(selectedIds).toHaveLength(2);

    // Verify IDs are in the correct arrays
    const recipientsById = store.get(recipientsByIdAtom);
    availableIds.forEach((id) => {
      expect(recipientsById[id]).toBeDefined();
    });
    selectedIds.forEach((id) => {
      expect(recipientsById[id]).toBeDefined();
    });
  });

  it("should assign unique IDs to recipients", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "user1@example.com", isSelected: false },
      { email: "user2@example.com", isSelected: false },
      { email: "user3@example.com", isSelected: false },
    ];

    runRecipientsPipeline(rawRecipients, store);

    const recipientsById = store.get(recipientsByIdAtom);
    const ids = Object.keys(recipientsById);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should sort recipient IDs alphabetically by email", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "zebra@example.com", isSelected: false },
      { email: "apple@example.com", isSelected: false },
      { email: "banana@example.com", isSelected: false },
    ];

    runRecipientsPipeline(rawRecipients, store);

    const availableIds = store.get(availableRecipientIdsAtom);
    const recipientsById = store.get(recipientsByIdAtom);

    expect(availableIds).toHaveLength(3);
    expect(recipientsById[availableIds[0]].email).toBe("apple@example.com");
    expect(recipientsById[availableIds[1]].email).toBe("banana@example.com");
    expect(recipientsById[availableIds[2]].email).toBe("zebra@example.com");
  });

  it("should handle large datasets", () => {
    const rawRecipients: RawRecipient[] = Array.from({ length: 1000 }, (_, i) => ({
      email: `user${i}@example.com`,
      isSelected: i % 2 === 0,
    }));

    runRecipientsPipeline(rawRecipients, store);

    const recipientsById = store.get(recipientsByIdAtom);
    const availableIds = store.get(availableRecipientIdsAtom);
    const selectedIds = store.get(selectedRecipientIdsAtom);

    expect(Object.keys(recipientsById)).toHaveLength(1000);
    expect(availableIds.length + selectedIds.length).toBe(1000);
  });

  it("should update store atoms correctly", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "user1@example.com", isSelected: false },
      { email: "user2@example.com", isSelected: true },
    ];

    runRecipientsPipeline(rawRecipients, store);

    const recipientsById = store.get(recipientsByIdAtom);
    const availableIds = store.get(availableRecipientIdsAtom);
    const selectedIds = store.get(selectedRecipientIdsAtom);

    // Verify structure
    expect(typeof recipientsById).toBe("object");
    expect(Array.isArray(availableIds)).toBe(true);
    expect(Array.isArray(selectedIds)).toBe(true);

    // Verify all available IDs exist in recipientsById
    availableIds.forEach((id) => {
      expect(recipientsById[id]).toBeDefined();
      expect(recipientsById[id]).toHaveProperty("id");
      expect(recipientsById[id]).toHaveProperty("email");
    });

    // Verify all selected IDs exist in recipientsById
    selectedIds.forEach((id) => {
      expect(recipientsById[id]).toBeDefined();
      expect(recipientsById[id]).toHaveProperty("id");
      expect(recipientsById[id]).toHaveProperty("email");
    });
  });

  it("should overwrite previous state when called multiple times", () => {
    const firstBatch: RawRecipient[] = [
      { email: "user1@example.com", isSelected: false },
    ];

    runRecipientsPipeline(firstBatch, store);

    const firstAvailableIds = store.get(availableRecipientIdsAtom);
    expect(firstAvailableIds).toHaveLength(1);

    const secondBatch: RawRecipient[] = [
      { email: "user2@example.com", isSelected: false },
      { email: "user3@example.com", isSelected: true },
    ];

    runRecipientsPipeline(secondBatch, store);

    const secondAvailableIds = store.get(availableRecipientIdsAtom);
    const secondSelectedIds = store.get(selectedRecipientIdsAtom);

    expect(secondAvailableIds).toHaveLength(1);
    expect(secondSelectedIds).toHaveLength(1);
    expect(secondAvailableIds).not.toEqual(firstAvailableIds);
  });
});

