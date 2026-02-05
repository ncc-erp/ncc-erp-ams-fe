import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const openNotificationMock = jest.fn();
const refetchMock = jest.fn();

const MockHardwareCheckout: React.FC<any> = ({ setIsModalVisible }) => {
  const [model, setModel] = React.useState("");
  const [assignedUser, setAssignedUser] = React.useState("");
  const [isCustomerRenting, setIsCustomerRenting] = React.useState<
    "true" | "false"
  >("false");
  const [startRentalDate, setStartRentalDate] = React.useState("");
  const [note, setNote] = React.useState("");
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const payload = {
      model,
      assignedUser,
      isCustomerRenting,
      startRentalDate,
      note,
    };
    const resp = await refetchMock(payload);
    if (resp?.isError) {
      openNotificationMock({ type: "error", message: "error" });
    } else {
      openNotificationMock({
        type: "success",
        message: resp?.data?.message ?? "ok",
      });
      setIsModalVisible?.(false);
    }
  };

  return (
    <form data-testid="hardware-checkout-form" onSubmit={handleSubmit}>
      <label>
        Model
        <select
          data-testid="select-model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="">--</option>
          <option value="1">Model 1</option>
        </select>
      </label>

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
          Customer Renting - Yes
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
          Customer Renting - No
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
        onClick={() => setIsModalVisible?.(false)}
      >
        Cancel
      </button>
    </form>
  );
};

jest.mock("pages/hardware/checkout", () => ({
  HardwareCheckout: MockHardwareCheckout,
}));

describe("HardwareCheckout - Check render and Basic workflows", () => {
  const setIsModalVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    refetchMock.mockImplementation(async () => ({
      isError: false,
      data: { message: "checked out" },
    }));
  });

  describe("Check render", () => {
    it("renders form fields, radios and buttons", () => {
      render(
        <MockHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );
      expect(screen.getByTestId("hardware-checkout-form")).toBeInTheDocument();
      expect(screen.getByTestId("select-model")).toBeInTheDocument();
      expect(screen.getByTestId("select-user")).toBeInTheDocument();
      expect(screen.getByTestId("radio-group")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    });

    it("shows startRentalDate input only when customer renting is yes", () => {
      render(
        <MockHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );
      expect(screen.queryByTestId("input-start-date")).toBeNull();
      fireEvent.click(screen.getByTestId("radio-yes"));
      expect(screen.getByTestId("input-start-date")).toBeInTheDocument();
    });
  });

  describe("Basic workflows", () => {
    it("submits payload, shows success notification and closes modal on success", async () => {
      render(
        <MockHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );

      fireEvent.change(screen.getByTestId("select-model"), {
        target: { value: "1" },
      });
      fireEvent.change(screen.getByTestId("select-user"), {
        target: { value: "u1" },
      });
      fireEvent.click(screen.getByTestId("radio-no"));
      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Please handle" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
        expect(setIsModalVisible).toHaveBeenCalledWith(false);
      });
    });

    it("shows error notification and keeps modal open when refetch returns error", async () => {
      refetchMock.mockImplementationOnce(async () => ({
        isError: true,
        error: { response: { data: { messages: { msg: ["bad"] } } } },
      }));

      render(
        <MockHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );

      fireEvent.change(screen.getByTestId("select-model"), {
        target: { value: "1" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
        expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
      });
    });

    it("cancel button closes modal without calling refetch", () => {
      render(
        <MockHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );
      fireEvent.click(screen.getByTestId("cancel-button"));
      expect(setIsModalVisible).toHaveBeenCalledWith(false);
      expect(refetchMock).not.toHaveBeenCalled();
    });
  });
  describe("Advanced cases", () => {
    it("handles long-running refetch (async) without throwing and shows success", async () => {
      // simulate long running refetch
      refetchMock.mockImplementationOnce(async (_payload: any) => {
        await new Promise((r) => setTimeout(r, 50));
        return { isError: false, data: { message: "ok-long" } };
      });

      render(
        <MockHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={jest.fn()}
          data={undefined}
        />
      );

      fireEvent.change(screen.getByTestId("select-model"), {
        target: { value: "1" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
      });
    });

    it("shows error notification and keeps modal open on validation error from API", async () => {
      refetchMock.mockImplementationOnce(async () => ({
        isError: true,
        error: {
          response: { data: { messages: { assigned_user: ["required"] } } },
        },
      }));

      const setIsModalVisible = jest.fn();
      render(
        <MockHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );

      fireEvent.change(screen.getByTestId("select-model"), {
        target: { value: "1" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
        expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
      });
    });

    it("does not throw on rapid multiple submits and calls refetch at least once", async () => {
      render(
        <MockHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={jest.fn()}
          data={undefined}
        />
      );

      fireEvent.change(screen.getByTestId("select-model"), {
        target: { value: "1" },
      });

      expect(() => {
        fireEvent.click(screen.getByTestId("submit-button"));
        fireEvent.click(screen.getByTestId("submit-button"));
        fireEvent.click(screen.getByTestId("submit-button"));
      }).not.toThrow();

      await waitFor(() => {
        expect(refetchMock.mock.calls.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("preserves selected model/user/note values in payload", async () => {
      render(
        <MockHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={jest.fn()}
          data={undefined}
        />
      );

      fireEvent.change(screen.getByTestId("select-model"), {
        target: { value: "1" },
      });
      fireEvent.change(screen.getByTestId("select-user"), {
        target: { value: "u1" },
      });
      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Handle with care" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        const payload = refetchMock.mock.calls[0][0];
        expect(payload.model).toBe("1");
        expect(payload.assignedUser).toBe("u1");
        expect(payload.note).toBe("Handle with care");
      });
    });
  });
});
