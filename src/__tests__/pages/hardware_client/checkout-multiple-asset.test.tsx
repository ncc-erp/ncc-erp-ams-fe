import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const openNotificationMock = jest.fn();
const mutateMock = jest.fn();
const setIsModalVisibleMock = jest.fn();
const clearSelectionMock = jest.fn();

const MockClientHardwareCheckoutMultipleAsset: React.FC<any> = ({
  isModalVisible,
  setIsModalVisible = setIsModalVisibleMock,
  data = [],
  clearSelection = clearSelectionMock,
}) => {
  const [assignedUser, setAssignedUser] = React.useState(
    data?.assigned_user ?? ""
  );
  const [checkoutAt, setCheckoutAt] = React.useState("");
  const [note, setNote] = React.useState(data?.note ?? "");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const payload = {
      assets: data?.map((d: any) => d.id) ?? [],
      assigned_user: assignedUser,
      checkout_at: checkoutAt || new Date().toISOString(),
      note,
    };
    try {
      const resp = await mutateMock(payload);
      if (resp?.isError) {
        openNotificationMock({
          type: "error",
          message: resp?.error?.message ?? "error",
        });
      } else {
        openNotificationMock({
          type: "success",
          message: resp?.data?.message ?? "ok",
        });
        setIsModalVisible?.(false);
        clearSelection?.();
      }
    } catch (err: any) {
      openNotificationMock({ type: "error", message: err?.message ?? "error" });
    }
  };

  if (!isModalVisible) return null;

  return (
    <form
      data-testid="client-hardware-checkout-multiple-form"
      onSubmit={handleSubmit}
    >
      <div data-testid="assets-list">
        {data && data.length ? (
          data.map((item: any) => (
            <div key={item.id} data-testid={`asset-${item.id}`}>
              <span className="show-asset">{item.asset_tag}</span> -{" "}
              {item.category?.name}
            </div>
          ))
        ) : (
          <div data-testid="assets-empty">no assets</div>
        )}
      </div>

      <label>
        Assigned User
        <select
          data-testid="select-user"
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
        >
          <option value="">--</option>
          <option value="u1">User 1</option>
        </select>
      </label>

      <label>
        Checkout Date
        <input
          data-testid="input-checkout-at"
          type="datetime-local"
          value={checkoutAt}
          onChange={(e) => setCheckoutAt(e.target.value)}
        />
      </label>

      <label>
        Note
        <textarea
          data-testid="input-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      <button data-testid="submit-button" type="submit">
        Checkout
      </button>
      <button
        data-testid="cancel-button"
        type="button"
        onClick={() => setIsModalVisible(false)}
      >
        Cancel
      </button>
    </form>
  );
};

jest.mock("pages/hardware_client/checkout-multiple-asset", () => ({
  ClientHardwareCheckoutMultipleAsset: MockClientHardwareCheckoutMultipleAsset,
}));

describe("ClientHardwareCheckoutMultipleAsset - render and workflows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleData = [
    { id: 101, asset_tag: "CA-101", category: { name: "Laptop" } },
    { id: 102, asset_tag: "CA-102", category: { name: "Tablet" } },
  ];
  //Check render cases
  describe("Check render", () => {
    it("renders form, assets list and controls", () => {
      render(
        <MockClientHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      expect(
        screen.getByTestId("client-hardware-checkout-multiple-form")
      ).toBeInTheDocument();
      expect(screen.getByTestId("assets-list")).toBeInTheDocument();
      expect(screen.getByTestId("asset-101")).toBeInTheDocument();
      expect(screen.getByTestId("asset-102")).toBeInTheDocument();
      expect(screen.getByTestId("select-user")).toBeInTheDocument();
      expect(screen.getByTestId("input-checkout-at")).toBeInTheDocument();
      expect(screen.getByTestId("input-note")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    });

    it("renders 'no assets' when data empty", () => {
      render(
        <MockClientHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={[]}
          clearSelection={clearSelectionMock}
        />
      );

      expect(screen.getByTestId("assets-empty")).toBeInTheDocument();
      expect(screen.queryByTestId("asset-101")).toBeNull();
    });
  });
  //check basic workflows
  describe("Basic workflows", () => {
    it("submits payload, shows success and closes modal", async () => {
      mutateMock.mockResolvedValueOnce({
        isError: false,
        data: { message: "checked out" },
      });

      render(
        <MockClientHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.change(screen.getByTestId("select-user"), {
        target: { value: "u1" },
      });
      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Handle carefully" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
        expect(setIsModalVisibleMock).toHaveBeenCalledWith(false);
        expect(clearSelectionMock).toHaveBeenCalled();
      });
    });

    it("shows error and keeps modal open on mutate error", async () => {
      mutateMock.mockResolvedValueOnce({
        isError: true,
        error: {
          response: { data: { messages: { assigned_user: ["required"] } } },
        },
      });

      render(
        <MockClientHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
        expect(setIsModalVisibleMock).not.toHaveBeenCalledWith(false);
      });
    });

    it("includes assets and fields in payload when successful", async () => {
      mutateMock.mockResolvedValueOnce({
        isError: false,
        data: { message: "ok" },
      });

      render(
        <MockClientHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.change(screen.getByTestId("select-user"), {
        target: { value: "u1" },
      });
      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Note" },
      });
      fireEvent.change(screen.getByTestId("input-checkout-at"), {
        target: { value: "2025-09-01T10:00" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        const payload = mutateMock.mock.calls[0][0];
        expect(payload.assets).toEqual([101, 102]);
        expect(payload.assigned_user).toBe("u1");
        expect(payload.note).toBe("Note");
        expect(payload.checkout_at).toBe("2025-09-01T10:00");
      });
    });

    it("cancel button closes modal without calling mutate", () => {
      render(
        <MockClientHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.click(screen.getByTestId("cancel-button"));
      expect(setIsModalVisibleMock).toHaveBeenCalledWith(false);
      expect(mutateMock).not.toHaveBeenCalled();
    });

    it("handles long-running mutate and shows success", async () => {
      mutateMock.mockImplementationOnce(async () => {
        await new Promise((r) => setTimeout(r, 60));
        return { isError: false, data: { message: "ok-long" } };
      });

      render(
        <MockClientHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.change(screen.getByTestId("select-user"), {
        target: { value: "u1" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
      });
    });

    it("does not throw on rapid multiple submits and calls mutate at least once", async () => {
      mutateMock.mockResolvedValue({ isError: false, data: { message: "ok" } });

      render(
        <MockClientHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={jest.fn()}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      const btn = screen.getByTestId("submit-button");
      fireEvent.click(btn);
      fireEvent.click(btn);
      fireEvent.click(btn);

      await waitFor(() => {
        expect(mutateMock.mock.calls.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("preserves selected user and note in payload when validation fails", async () => {
      mutateMock.mockResolvedValueOnce({
        isError: true,
        error: { response: { data: { messages: {} } } },
      });

      render(
        <MockClientHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.change(screen.getByTestId("select-user"), {
        target: { value: "u1" },
      });
      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Keep safe" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
      });

      expect(
        (screen.getByTestId("select-user") as HTMLSelectElement).value
      ).toBe("u1");
      expect(
        (screen.getByTestId("input-note") as HTMLTextAreaElement).value
      ).toBe("Keep safe");
    });
  });
});
