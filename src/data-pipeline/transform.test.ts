// Mock uuid before imports
let mockUuidCounter = 0;
jest.mock("uuid", () => ({
  v4: () => {
    mockUuidCounter += 1;
    return `mock-uuid-${mockUuidCounter}`;
  },
}));

import { transformRecipients, RawRecipient, TransformedRecipient } from "./transform";

describe("transformRecipients", () => {
  beforeEach(() => {
    // Reset UUID counter for each test
    mockUuidCounter = 0;
    jest.clearAllMocks();
  });
  it("should transform empty array", () => {
    const result = transformRecipients([]);
    expect(result).toEqual([]);
  });

  it("should assign unique IDs to each recipient", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "user1@example.com", isSelected: false },
      { email: "user2@example.com", isSelected: true },
    ];

    const result = transformRecipients(rawRecipients);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBeDefined();
    expect(result[1].id).toBeDefined();
    expect(result[0].id).not.toBe(result[1].id);
  });

  it("should preserve email and isSelected properties", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "user1@example.com", isSelected: false },
      { email: "user2@example.com", isSelected: true },
    ];

    const result = transformRecipients(rawRecipients);

    expect(result[0].email).toBe("user1@example.com");
    expect(result[0].isSelected).toBe(false);
    expect(result[1].email).toBe("user2@example.com");
    expect(result[1].isSelected).toBe(true);
  });

  it("should generate unique IDs", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "user@example.com", isSelected: false },
    ];

    const result = transformRecipients(rawRecipients);

    expect(result[0].id).toBeDefined();
    expect(typeof result[0].id).toBe("string");
    expect(result[0].id.length).toBeGreaterThan(0);
  });

  it("should handle large arrays", () => {
    const rawRecipients: RawRecipient[] = Array.from({ length: 1000 }, (_, i) => ({
      email: `user${i}@example.com`,
      isSelected: i % 2 === 0,
    }));

    const result = transformRecipients(rawRecipients);

    expect(result).toHaveLength(1000);
    const ids = new Set(result.map((r) => r.id));
    expect(ids.size).toBe(1000); // All IDs should be unique
  });

  it("should maintain order of recipients", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "first@example.com", isSelected: false },
      { email: "second@example.com", isSelected: true },
      { email: "third@example.com", isSelected: false },
    ];

    const result = transformRecipients(rawRecipients);

    expect(result[0].email).toBe("first@example.com");
    expect(result[1].email).toBe("second@example.com");
    expect(result[2].email).toBe("third@example.com");
  });

  it("should handle recipients with same email but different selection state", () => {
    const rawRecipients: RawRecipient[] = [
      { email: "user@example.com", isSelected: false },
      { email: "user@example.com", isSelected: true },
    ];

    const result = transformRecipients(rawRecipients);

    expect(result).toHaveLength(2);
    expect(result[0].email).toBe(result[1].email);
    expect(result[0].isSelected).toBe(false);
    expect(result[1].isSelected).toBe(true);
    expect(result[0].id).not.toBe(result[1].id);
  });
});

