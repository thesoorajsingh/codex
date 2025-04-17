import { describe, it, expect, vi } from "vitest";

describe("model selection handler", () => {
  it("calls setModel and others when model is valid", () => {
    const availableModels = ["gpt-3.5", "model-1"];
    const model = "gpt-3.5";

    const setModel = vi.fn();
    const setLastResponseId = vi.fn();
    const setItems = vi.fn();
    const setOverlayMode = vi.fn();

    const onSelect = (newModel: string) => {
      if (!availableModels.includes(newModel)) {
        // eslint-disable-next-line no-console
        console.error(`Model "${newModel}" not available`);
        setOverlayMode("none");
        return;
      }

      setModel(newModel);
      setLastResponseId((prev: string | null) =>
        prev && newModel !== model ? null : prev
      );
      setItems((prev: Array<any>) => [
        ...prev,
        {
          id: "test-id",
          type: "message",
          role: "system",
          content: [
            {
              type: "input_text",
              text: `Switched model to ${newModel}`,
            },
          ],
        },
      ]);
      setOverlayMode("none");
    };

    onSelect("model-1");

    expect(setModel).toHaveBeenCalledWith("model-1");
    expect(setLastResponseId).toHaveBeenCalled();
    expect(setItems).toHaveBeenCalled();
    expect(setOverlayMode).toHaveBeenCalledWith("none");
  });

  it("does not update state and logs error when model is invalid", () => {
    const availableModels = ["gpt-3.5", "model-1"];
    const model = "gpt-3.5";

    const setModel = vi.fn();
    const setLastResponseId = vi.fn();
    const setItems = vi.fn();
    const setOverlayMode = vi.fn();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const onSelect = (newModel: string) => {
      if (!availableModels.includes(newModel)) {
        // eslint-disable-next-line no-console
        console.error(`Model "${newModel}" not available`);
        setOverlayMode("none");
        return;
      }

      setModel(newModel);
      setLastResponseId((prev: string | null) =>
        prev && newModel !== model ? null : prev
      );
      setItems((prev: Array<any>) => [
        ...prev,
        {
          id: "test-id",
          type: "message",
          role: "system",
          content: [
            {
              type: "input_text",
              text: `Switched model to ${newModel}`,
            },
          ],
        },
      ]);
      setOverlayMode("none");
    };

    onSelect("invalid-model");

    expect(setModel).not.toHaveBeenCalled();
    expect(setLastResponseId).not.toHaveBeenCalled();
    expect(setItems).not.toHaveBeenCalled();
    expect(setOverlayMode).toHaveBeenCalledWith("none");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});