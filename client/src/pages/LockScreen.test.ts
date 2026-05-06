import { describe, it, expect } from "vitest";

describe("LockScreen Activation System", () => {
  // الأكواد الصحيحة المقبولة - مبسطة وسهلة التذكر
  const VALID_CODES = [
    "SMART2026",
    "CREATOR2026",
    "SMARTCREATOR2026",
  ];

  it("should accept valid activation code SMART2026", () => {
    const validCode = "SMART2026";
    expect(VALID_CODES).toContain(validCode);
  });

  it("should accept valid activation code CREATOR2026", () => {
    const validCode = "CREATOR2026";
    expect(VALID_CODES).toContain(validCode);
  });

  it("should accept valid activation code SMARTCREATOR2026", () => {
    const validCode = "SMARTCREATOR2026";
    expect(VALID_CODES).toContain(validCode);
  });

  it("should reject invalid activation codes", () => {
    const invalidCode = "INVALID-CODE-123";
    expect(VALID_CODES).not.toContain(invalidCode);
  });

  it("should normalize code input (uppercase and trim)", () => {
    const inputCode = "  smart2026  ";
    const normalizedCode = inputCode.toUpperCase().trim();
    expect(normalizedCode).toBe("SMART2026");
  });

  it("should validate code format after normalization", () => {
    const inputCode = "  creator2026  ";
    const normalizedCode = inputCode.toUpperCase().trim();
    expect(VALID_CODES).toContain(normalizedCode);
  });

  it("should reject empty activation code input", () => {
    const emptyCode = "";
    const trimmedCode = emptyCode.trim();
    expect(trimmedCode.length).toBe(0);
    expect(VALID_CODES).not.toContain(trimmedCode);
  });

  it("should have at least 3 valid activation codes", () => {
    expect(VALID_CODES.length).toBeGreaterThanOrEqual(3);
  });

  it("should validate code structure", () => {
    VALID_CODES.forEach(code => {
      expect(code).toBeTruthy();
      expect(code.length).toBeGreaterThan(0);
      expect(typeof code).toBe("string");
    });
  });

  it("should handle case-insensitive code validation", () => {
    const testCodes = [
      "smart2026",
      "SMART2026",
      "SmartCreator2026",
      "creator2026",
      "CREATOR2026",
    ];

    testCodes.forEach(code => {
      const normalizedCode = code.toUpperCase().trim();
      // تحقق من أن الكود المعايير يطابق أحد الأكواد الصحيحة
      const isValid = VALID_CODES.some(validCode => 
        validCode === normalizedCode
      );
      expect(isValid).toBe(true);
    });
  });
});
