import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { submitFeedback } from "./metricsApi";

describe("submitFeedback", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.useRealTimers();
  });

  it("handles timeout correctly and returns failed status", async () => {
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((_, reject) => {
          const err = new Error("The operation was aborted");
          err.name = "AbortError";
          setTimeout(() => reject(err), 100);
        })
    );

    const promise = submitFeedback(5, "Great work!", null);
    vi.advanceTimersByTime(150);
    const result = await promise;

    expect(result.success).toBe(false);
    expect(result.timedOut).toBe(true);
    expect(result.error).toBe("Failed to send — try again");
  });
});
