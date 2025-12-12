//@ts-nocheck
describe("Utility Functions", () => {
  const utils = require("../utils");

  it("should correctly extract token from Authorization header", () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer sampleToken123",
      },
    };

    const token = utils(mockRequest);
    expect(token).toBe("sampleToken123");
  });

  it("should return null if Authorization header is missing", () => {
    const mockRequest = {
      headers: {},
    };

    const token = utils(mockRequest);
    expect(token).toBeNull();
  });

  it("should return null if Authorization header is not Bearer type", () => {
    const mockRequest = {
      headers: {
        authorization: "Basic someOtherToken",
      },
    };

    const token = utils(mockRequest);
    expect(token).toBeNull();
  });
});
