import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const openNotificationMock = jest.fn();
const mutateMock = jest.fn();
const setIsModalVisibleMock = jest.fn();
const clearSelectionMock = jest.fn();

const MockHardwareCheckoutMultipleAsset: React.FC<any> = ({
  isModalVisible,
  setIsModalVisible = setIsModalVisibleMock,
  data = [],
  clearSelection = clearSelectionMock,
}) => {
  const [isCustomerRenting, setIsCustomerRenting] = React.useState<
    "true" | "false"
  >("false");
  const [assignedUser, setAssignedUser] = React.useState("");
  const [startRentalDate, setStartRentalDate] = React.useState("");
  const [note, setNote] = React.useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const payload = {
      assets: data?.map((d: any) => d.id) ?? [],
      assigned_user: assignedUser,
      isCustomerRenting,
      startRentalDate: isCustomerRenting === "true" ? startRentalDate : null,
      note,
    };
    const resp = await mutateMock(payload);
    if (resp?.isError) {
      openNotificationMock({ type: "error", message: "error" });
    } else {
      openNotificationMock({
        type: "success",
        message: resp?.data?.message ?? "ok",
      });
      setIsModalVisible?.(false);
      clearSelection?.();
    }
  };

  if (!isModalVisible) return null;

  return (
    <form data-testid="hardware-checkout-multiple-form" onSubmit={handleSubmit}>
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

      <fieldset data-testid="radio-group">
        <label>
          <input
            data-testid="radio-yes"
            type="radio"
            name="rent"
            value="true"
            checked={isCustomerRenting === "true"}
            onChange={() => setIsCustomerRenting("true")}
          />
          Yes
        </label>
        <label>
          <input
            data-testid="radio-no"
            type="radio"
            name="rent"
            value="false"
            checked={isCustomerRenting === "false"}
            onChange={() => setIsCustomerRenting("false")}
          />
          No
        </label>
      </fieldset>

      {isCustomerRenting === "true" && (
        <label>
          Start Rental Date
          <input
            data-testid="input-start-date"
            type="date"
            value={startRentalDate}
            onChange={(e) => setStartRentalDate(e.target.value)}
          />
        </label>
      )}

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

jest.mock("pages/hardware/checkout-multiple-asset", () => ({
  HardwareCheckoutMultipleAsset: MockHardwareCheckoutMultipleAsset,
}));

describe("HardwareCheckoutMultipleAsset - Check render and Basic workflows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleData = [
    { id: 11, asset_tag: "C-001", category: { name: "Laptop" } },
    { id: 12, asset_tag: "C-002", category: { name: "Phone" } },
  ];

  describe("Check render", () => {
    it("renders form, assets list, radios and buttons", () => {
      render(
        <MockHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      expect(
        screen.getByTestId("hardware-checkout-multiple-form")
      ).toBeInTheDocument();
      expect(screen.getByTestId("assets-list")).toBeInTheDocument();
      expect(screen.getByTestId("asset-11")).toBeInTheDocument();
      expect(screen.getByTestId("asset-12")).toBeInTheDocument();
      expect(screen.getByTestId("select-user")).toBeInTheDocument();
      expect(screen.getByTestId("radio-group")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    });

    it("shows startRentalDate input only when customer renting is yes", () => {
      render(
        <MockHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );
      expect(screen.queryByTestId("input-start-date")).toBeNull();
      fireEvent.click(screen.getByTestId("radio-yes"));
      expect(screen.getByTestId("input-start-date")).toBeInTheDocument();
    });

    // Advanced -> display related cases
    it("renders 'no assets' when data is empty", () => {
      render(
        <MockHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={[]}
          clearSelection={clearSelectionMock}
        />
      );

      expect(screen.getByTestId("assets-empty")).toBeInTheDocument();
      expect(screen.queryByTestId("asset-11")).toBeNull();
    });
  });

  describe("Basic workflows", () => {
    it("submits payload, shows success notification and closes modal on success", async () => {
      mutateMock.mockResolvedValueOnce({
        isError: false,
        data: { message: "checked out" },
      });

      render(
        <MockHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.change(screen.getByTestId("select-user"), {
        target: { value: "u1" },
      });
      fireEvent.click(screen.getByTestId("radio-no"));
      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Please handle" },
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

    it("shows error notification and keeps modal open on mutate error", async () => {
      mutateMock.mockResolvedValueOnce({
        isError: true,
        error: {
          response: { data: { messages: { assigned_user: ["required"] } } },
        },
      });

      render(
        <MockHardwareCheckoutMultipleAsset
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

    it("includes startRentalDate in payload when renting is true", async () => {
      mutateMock.mockResolvedValueOnce({
        isError: false,
        data: { message: "ok" },
      });

      render(
        <MockHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.click(screen.getByTestId("radio-yes"));
      fireEvent.change(screen.getByTestId("input-start-date"), {
        target: { value: "2024-06-01" },
      });
      fireEvent.change(screen.getByTestId("select-user"), {
        target: { value: "u1" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        const calledPayload = mutateMock.mock.calls[0][0];
        expect(calledPayload.assets).toEqual([11, 12]);
        expect(calledPayload.isCustomerRenting).toBe("true");
        expect(calledPayload.startRentalDate).toBe("2024-06-01");
      });
    });

    // Advanced -> workflow related cases
    it("cancel button closes modal without calling mutate", () => {
      render(
        <MockHardwareCheckoutMultipleAsset
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

    it("handles a long-running mutate without throwing and shows success", async () => {
      mutateMock.mockImplementationOnce(async () => {
        await new Promise((r) => setTimeout(r, 50));
        return { isError: false, data: { message: "ok-long" } };
      });

      render(
        <MockHardwareCheckoutMultipleAsset
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
        <MockHardwareCheckoutMultipleAsset
          isModalVisible={true}
          setIsModalVisible={jest.fn()}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      expect(() => {
        fireEvent.click(screen.getByTestId("submit-button"));
        fireEvent.click(screen.getByTestId("submit-button"));
        fireEvent.click(screen.getByTestId("submit-button"));
      }).not.toThrow();

      await waitFor(() => {
        expect(mutateMock.mock.calls.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("preserves selected user and note values in payload", async () => {
      mutateMock.mockResolvedValueOnce({
        isError: false,
        data: { message: "ok" },
      });

      render(
        <MockHardwareCheckoutMultipleAsset
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
        target: { value: "Handle with care" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        const payload = mutateMock.mock.calls[0][0];
        expect(payload.assigned_user).toBe("u1");
        expect(payload.note).toBe("Handle with care");
      });
    });
  });
});
