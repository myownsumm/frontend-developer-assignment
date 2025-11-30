import { normalizeRecipients } from "./normalize";
import { TransformedRecipient } from "./transform";
import { Recipient } from "../types/recipients";

describe("normalizeRecipients", () => {
  it("should normalize empty array", () => {
    const result = normalizeRecipients([]);

    expect(result.recipientsById).toEqual({});
    expect(result.availableRecipientIds).toEqual([]);
    expect(result.selectedRecipientIds).toEqual([]);
  });

  it("should separate available and selected recipients", () => {
    const transformed: TransformedRecipient[] = [
      { id: "id1", email: "user1@example.com", isSelected: false },
      { id: "id2", email: "user2@example.com", isSelected: true },
      { id: "id3", email: "user3@example.com", isSelected: false },
    ];

    const result = normalizeRecipients(transformed);

    expect(result.availableRecipientIds).toEqual(["id1", "id3"]);
    expect(result.selectedRecipientIds).toEqual(["id2"]);
  });

  it("should create recipientsById map", () => {
    const transformed: TransformedRecipient[] = [
      { id: "id1", email: "user1@example.com", isSelected: false },
      { id: "id2", email: "user2@example.com", isSelected: true },
    ];

    const result = normalizeRecipients(transformed);

    expect(result.recipientsById).toEqual({
      id1: { id: "id1", email: "user1@example.com" },
      id2: { id: "id2", email: "user2@example.com" },
    });
  });

  it("should remove isSelected property from recipients", () => {
    const transformed: TransformedRecipient[] = [
      { id: "id1", email: "user1@example.com", isSelected: false },
    ];

    const result = normalizeRecipients(transformed);

    const recipient = result.recipientsById["id1"];
    expect(recipient).not.toHaveProperty("isSelected");
    expect(recipient).toEqual({ id: "id1", email: "user1@example.com" });
  });

  it("should sort available recipient IDs alphabetically by email", () => {
    const transformed: TransformedRecipient[] = [
      { id: "id3", email: "zebra@example.com", isSelected: false },
      { id: "id1", email: "apple@example.com", isSelected: false },
      { id: "id2", email: "banana@example.com", isSelected: false },
    ];

    const result = normalizeRecipients(transformed);

    expect(result.availableRecipientIds).toEqual(["id1", "id2", "id3"]);
  });

  it("should sort selected recipient IDs alphabetically by email", () => {
    const transformed: TransformedRecipient[] = [
      { id: "id3", email: "zebra@example.com", isSelected: true },
      { id: "id1", email: "apple@example.com", isSelected: true },
      { id: "id2", email: "banana@example.com", isSelected: true },
    ];

    const result = normalizeRecipients(transformed);

    expect(result.selectedRecipientIds).toEqual(["id1", "id2", "id3"]);
  });

  it("should handle case-insensitive email sorting", () => {
    const transformed: TransformedRecipient[] = [
      { id: "id1", email: "Apple@example.com", isSelected: false },
      { id: "id2", email: "banana@example.com", isSelected: false },
      { id: "id3", email: "ZEBRA@example.com", isSelected: false },
    ];

    const result = normalizeRecipients(transformed);

    expect(result.availableRecipientIds).toEqual(["id1", "id2", "id3"]);
  });

  it("should handle recipients with only available or only selected", () => {
    const onlyAvailable: TransformedRecipient[] = [
      { id: "id1", email: "user1@example.com", isSelected: false },
      { id: "id2", email: "user2@example.com", isSelected: false },
    ];

    const resultAvailable = normalizeRecipients(onlyAvailable);
    expect(resultAvailable.availableRecipientIds).toHaveLength(2);
    expect(resultAvailable.selectedRecipientIds).toHaveLength(0);

    const onlySelected: TransformedRecipient[] = [
      { id: "id1", email: "user1@example.com", isSelected: true },
      { id: "id2", email: "user2@example.com", isSelected: true },
    ];

    const resultSelected = normalizeRecipients(onlySelected);
    expect(resultSelected.availableRecipientIds).toHaveLength(0);
    expect(resultSelected.selectedRecipientIds).toHaveLength(2);
  });

  it("should handle large datasets", () => {
    const transformed: TransformedRecipient[] = Array.from(
      { length: 1000 },
      (_, i) => ({
        id: `id${i}`,
        email: `user${i}@example.com`,
        isSelected: i % 2 === 0,
      })
    );

    const result = normalizeRecipients(transformed);

    expect(Object.keys(result.recipientsById)).toHaveLength(1000);
    expect(result.availableRecipientIds.length + result.selectedRecipientIds.length).toBe(1000);
    expect(result.availableRecipientIds.length).toBe(500);
    expect(result.selectedRecipientIds.length).toBe(500);
  });

  it("should maintain correct mapping between IDs and recipients", () => {
    const transformed: TransformedRecipient[] = [
      { id: "id1", email: "user1@example.com", isSelected: false },
      { id: "id2", email: "user2@example.com", isSelected: true },
    ];

    const result = normalizeRecipients(transformed);

    expect(result.recipientsById[result.availableRecipientIds[0]]).toEqual({
      id: "id1",
      email: "user1@example.com",
    });
    expect(result.recipientsById[result.selectedRecipientIds[0]]).toEqual({
      id: "id2",
      email: "user2@example.com",
    });
  });
});

