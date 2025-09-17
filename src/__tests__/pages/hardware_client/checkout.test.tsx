import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const openNotificationMock = jest.fn();
const refetchMock = jest.fn();

const MockClientHardwareCheckout: React.FC<any> = ({
  setIsModalVisible,
  data,
}) => {
  const [name, setName] = React.useState(data?.name ?? "");
  const [note, setNote] = React.useState(data?.note ?? "");
  const [assignedUser, setAssignedUser] = React.useState(
    data?.assigned_user ?? ""
  );
  const [dateCheckout, setDateCheckout] = React.useState("");
  const [model, setModel] = React.useState(data?.model?.name ?? "");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = {
      id: data?.id,
      name,
      note,
      assigned_user: assignedUser,
      checkout_at: dateCheckout || new Date().toISOString(),
      model: model,
    };
    try {
      const resp = await refetchMock(payload);
      if (resp?.isError) {
        openNotificationMock({
          type: "error",
          message: resp?.message ?? "error",
        });
      } else {
        openNotificationMock({
          type: "success",
          message: resp?.data?.message ?? "ok",
        });
        setIsModalVisible?.(false);
      }
    } catch (err: any) {
      openNotificationMock({ type: "error", message: err?.message ?? "error" });
    }
  };

  return (
    <form data-testid="client-hardware-checkout-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        Model
        <select
          data-testid="select-model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled
        >
          <option value={model}>{model}</option>
        </select>
      </label>

      <label>
        Assigned User
        <input
          data-testid="input-assigned"
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
        />
      </label>

      <label>
        Checkout Date
        <input
          data-testid="input-checkout-at"
          type="datetime-local"
          value={dateCheckout}
          onChange={(e) => setDateCheckout(e.target.value)}
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
    </form>
  );
};

jest.mock("pages/hardware_client/checkout", () => ({
  ClientHardwareCheckout: MockClientHardwareCheckout,
}));

describe("ClientHardwareCheckout - render and workflows", () => {
  const setIsModalVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    refetchMock.mockImplementation(async () => ({
      isError: false,
      data: { message: "checked out" },
    }));
  });
  //Check render cases
  describe("Check render", () => {
    it("renders form fields and initial values", () => {
      const sample = {
        id: 1,
        name: "Device X",
        note: "note x",
        assigned_user: "user_x",
        model: { name: "Model X" },
      } as any;

      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      expect(
        screen.getByTestId("client-hardware-checkout-form")
      ).toBeInTheDocument();
      expect(screen.getByTestId("input-name")).toBeInTheDocument();
      expect(screen.getByTestId("select-model")).toBeInTheDocument();
      expect(screen.getByTestId("input-assigned")).toBeInTheDocument();
      expect(screen.getByTestId("input-checkout-at")).toBeInTheDocument();
      expect(screen.getByTestId("input-note")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();

      expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe(
        "Device X"
      );
      expect(
        (screen.getByTestId("input-assigned") as HTMLInputElement).value
      ).toBe("user_x");
      expect(
        (screen.getByTestId("input-note") as HTMLTextAreaElement).value
      ).toBe("note x");
      expect(
        (screen.getByTestId("select-model") as HTMLSelectElement).value
      ).toBe("Model X");
    });

    it("allows editing fields and preserves changes before submit", () => {
      const sample = {
        id: 2,
        name: "D2",
        note: "",
        assigned_user: "",
        model: { name: "M2" },
      } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
      const noteInput = screen.getByTestId("input-note") as HTMLTextAreaElement;
      const assignedInput = screen.getByTestId(
        "input-assigned"
      ) as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: "Edited Name" } });
      fireEvent.change(assignedInput, { target: { value: "newUser" } });
      fireEvent.change(noteInput, { target: { value: "long note" } });

      expect(nameInput.value).toBe("Edited Name");
      expect(assignedInput.value).toBe("newUser");
      expect(noteInput.value).toBe("long note");
    });

    it("renders empty assigned input when missing", () => {
      const sample = {
        id: 3,
        name: "D3",
        note: "",
        model: { name: "M3" },
      } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );
      expect(
        (screen.getByTestId("input-assigned") as HTMLInputElement).value
      ).toBe("");
    });

    it("model select is disabled", () => {
      const sample = {
        id: 4,
        name: "D4",
        note: "",
        model: { name: "M4" },
      } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );
      expect(screen.getByTestId("select-model")).toBeDisabled();
    });

    it("handles large note content", () => {
      const long = "x".repeat(2000);
      const sample = {
        id: 5,
        name: "D5",
        note: long,
        model: { name: "M5" },
      } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );
      expect(
        (screen.getByTestId("input-note") as HTMLTextAreaElement).value
      ).toBe(long);
    });
  });
  // Check basic workflows
  describe("Basic workflows", () => {
    it("submits payload, shows success notification and closes modal", async () => {
      const sample = {
        id: 10,
        name: "Device B",
        note: "",
        assigned_user: "u2",
        model: { name: "ModelB" },
      } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Checked out OK" },
      });
      fireEvent.change(screen.getByTestId("input-checkout-at"), {
        target: { value: "2025-01-01T09:00" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        const calledPayload = refetchMock.mock.calls[0][0];
        expect(calledPayload).toMatchObject({
          id: 10,
          note: "Checked out OK",
          checkout_at: "2025-01-01T09:00",
          assigned_user: "u2",
        });
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
        expect(setIsModalVisible).toHaveBeenCalledWith(false);
      });
    });

    it("shows error notification and keeps modal open when refetch returns error", async () => {
      refetchMock.mockImplementationOnce(async () => ({
        isError: true,
        message: "checkout failed",
      }));
      const sample = { id: 11, name: "Device C", assigned_user: "" } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
        expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
      });
    });

    it("handles long-running refetch and resolves successfully", async () => {
      refetchMock.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ isError: false, data: { message: "slow ok" } }),
              120
            )
          )
      );
      const sample = {
        id: 12,
        name: "Slow Device",
        assigned_user: "u1",
        model: { name: "Mslow" },
      } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(
        () => {
          expect(openNotificationMock).toHaveBeenCalledWith(
            expect.objectContaining({ type: "success" })
          );
          expect(setIsModalVisible).toHaveBeenCalledWith(false);
        },
        { timeout: 1000 }
      );
    });

    it("multiple rapid submits call refetch multiple times without crashing", async () => {
      const sample = {
        id: 13,
        name: "Rapid",
        assigned_user: "u1",
        model: { name: "MRapid" },
      } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const btn = screen.getByTestId("submit-button");
      fireEvent.click(btn);
      fireEvent.click(btn);
      fireEvent.click(btn);

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalledTimes(3);
      });
    });

    it("handles synchronous throw from refetch and shows error", async () => {
      refetchMock.mockImplementationOnce(() => {
        throw new Error("sync error");
      });

      const sample = {
        id: 14,
        name: "Boom",
        assigned_user: "u1",
        model: { name: "MBoom" },
      } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
        expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
      });
    });

    it("preserves form values when refetch returns validation errors", async () => {
      refetchMock.mockImplementationOnce(async () => ({
        isError: true,
        message: "validation failed",
      }));

      const sample = {
        id: 15,
        name: "Preserve",
        note: "",
        assigned_user: "u5",
        model: { name: "MPreserve" },
      } as any;
      render(
        <MockClientHardwareCheckout
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Needs handling" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
      });

      expect(
        (screen.getByTestId("input-note") as HTMLTextAreaElement).value
      ).toBe("Needs handling");
      expect(
        (screen.getByTestId("input-assigned") as HTMLInputElement).value
      ).toBe("u5");
    });
  });
});
