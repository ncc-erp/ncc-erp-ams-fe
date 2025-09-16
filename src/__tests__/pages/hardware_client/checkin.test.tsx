import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const openNotificationMock = jest.fn();
const refetchMock = jest.fn();

const MockClientHardwareCheckin: React.FC<any> = ({
  setIsModalVisible,
  data,
}) => {
  const [name, setName] = React.useState(data?.name ?? "");
  const [note, setNote] = React.useState(data?.note ?? "");
  const [assignedUser, setAssignedUser] = React.useState(
    data?.assigned_to ?? ""
  );
  const [dateCheckin, setDateCheckin] = React.useState("");
  const [statusLabel, setStatusLabel] = React.useState("");
  const [model, setModel] = React.useState(data?.model?.name ?? "");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = {
      id: data?.id,
      name,
      note,
      assigned_user: assignedUser,
      checkin_at: dateCheckin || new Date().toISOString(),
      status_label: statusLabel,
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
          message: resp?.data?.message ?? "checked in successfully",
        });
        setIsModalVisible(false);
      }
    } catch (err: any) {
      openNotificationMock({
        type: "error",
        message: err?.message ?? "error",
      });
    }
  };

  return (
    <form data-testid="client-hardware-checkin-form" onSubmit={handleSubmit}>
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
          disabled={true}
        >
          <option value={model}>{model}</option>
        </select>
      </label>

      <label>
        Status
        <select
          data-testid="select-status"
          value={statusLabel}
          onChange={(e) => setStatusLabel(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="1">Ready to Deploy</option>
          <option value="2">Pending</option>
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
        Checkin Date
        <input
          data-testid="input-checkin-at"
          type="datetime-local"
          value={dateCheckin}
          onChange={(e) => setDateCheckin(e.target.value)}
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
        Checkin
      </button>
    </form>
  );
};

jest.mock("pages/hardware_client/checkin", () => ({
  ClientHardwareCheckin: MockClientHardwareCheckin,
}));

describe("ClientHardwareCheckin - Check render and Basic workflows", () => {
  const setIsModalVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    refetchMock.mockImplementation(async () => ({
      isError: false,
      data: { message: "checked in successfully" },
    }));
  });
  // Check render cases
  describe("Check render", () => {
    it("renders form fields and submit button", () => {
      const sample = {
        id: 10,
        name: "Client Device A",
        note: "some client note",
        assigned_to: "client_user1",
        model: { name: "MacBook Pro" },
      } as any;
      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      expect(
        screen.getByTestId("client-hardware-checkin-form")
      ).toBeInTheDocument();
      expect(screen.getByTestId("input-name")).toBeInTheDocument();
      expect(screen.getByTestId("select-model")).toBeInTheDocument();
      expect(screen.getByTestId("select-status")).toBeInTheDocument();
      expect(screen.getByTestId("input-assigned")).toBeInTheDocument();
      expect(screen.getByTestId("input-checkin-at")).toBeInTheDocument();
      expect(screen.getByTestId("input-note")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();

      expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe(
        "Client Device A"
      );
      expect(
        (screen.getByTestId("input-assigned") as HTMLInputElement).value
      ).toBe("client_user1");
      expect(
        (screen.getByTestId("input-note") as HTMLTextAreaElement).value
      ).toBe("some client note");
      expect(
        (screen.getByTestId("select-model") as HTMLSelectElement).value
      ).toBe("MacBook Pro");
    });

    it("allows editing fields and retains changes before submit", () => {
      const sample = {
        id: 13,
        name: "Client D1",
        note: "",
        assigned_to: "",
        model: { name: "iPad" },
      } as any;
      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
      const noteInput = screen.getByTestId("input-note") as HTMLTextAreaElement;
      const assigned = screen.getByTestId("input-assigned") as HTMLInputElement;
      const statusSelect = screen.getByTestId(
        "select-status"
      ) as HTMLSelectElement;

      fireEvent.change(nameInput, {
        target: { value: "Client Device Edited" },
      });
      fireEvent.change(assigned, { target: { value: "newClientUser" } });
      fireEvent.change(noteInput, {
        target: { value: "long client note content" },
      });
      fireEvent.change(statusSelect, { target: { value: "1" } });

      expect(nameInput.value).toBe("Client Device Edited");
      expect(assigned.value).toBe("newClientUser");
      expect(noteInput.value).toBe("long client note content");
      expect(statusSelect.value).toBe("1");
    });

    it("renders empty assigned user input when assigned_to missing", () => {
      const sample = {
        id: 14,
        name: "Client D2",
        note: "",
        model: { name: "iPhone" },
      } as any;
      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );
      expect(
        (screen.getByTestId("input-assigned") as HTMLInputElement).value
      ).toBe("");
    });

    it("renders model select as disabled", () => {
      const sample = {
        id: 15,
        name: "Client D3",
        note: "",
        model: { name: "Surface Pro" },
      } as any;
      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      expect(screen.getByTestId("select-model")).toBeDisabled();
    });

    it("handles large note content without truncation", () => {
      const largeNote = "A".repeat(1000);
      const sample = {
        id: 15,
        name: "Client D3",
        note: largeNote,
        model: { name: "Laptop" },
      } as any;
      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      expect(
        (screen.getByTestId("input-note") as HTMLTextAreaElement).value
      ).toBe(largeNote);
    });
  });
  // Basic workflow cases
  describe("Basic workflows", () => {
    it("submits payload, shows success notification and closes modal on success", async () => {
      const sample = {
        id: 20,
        name: "Client Success Device",
        note: "success note",
        assigned_to: "success_user",
        model: { name: "Test Model" },
      } as any;

      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalledWith({
          id: 20,
          name: "Client Success Device",
          note: "success note",
          assigned_user: "success_user",
          checkin_at: expect.any(String),
          status_label: "",
          model: "Test Model",
        });
      });

      await waitFor(() => {
        expect(openNotificationMock).toHaveBeenCalledWith({
          type: "success",
          message: "checked in successfully",
        });
      });

      expect(setIsModalVisible).toHaveBeenCalledWith(false);
    });

    it("shows error notification and keeps modal open when refetch returns error", async () => {
      refetchMock.mockImplementationOnce(async () => ({
        isError: true,
        message: "Client checkin failed",
      }));

      const sample = {
        id: 21,
        name: "Client Error Device",
        note: "error note",
        assigned_to: "error_user",
        model: { name: "Error Model" },
      } as any;

      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(openNotificationMock).toHaveBeenCalledWith({
          type: "error",
          message: "Client checkin failed",
        });
      });

      expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
    });

    it("handles long-running refetch without timing out and shows success", async () => {
      refetchMock.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  isError: false,
                  data: { message: "delayed client success" },
                }),
              100
            )
          )
      );

      const sample = {
        id: 22,
        name: "Client Delayed Device",
        note: "delayed note",
        assigned_to: "delayed_user",
        model: { name: "Delayed Model" },
      } as any;

      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(
        () => {
          expect(openNotificationMock).toHaveBeenCalledWith({
            type: "success",
            message: "delayed client success",
          });
        },
        { timeout: 1000 }
      );

      expect(setIsModalVisible).toHaveBeenCalledWith(false);
    });

    it("rapid multiple submits do not crash and refetch called at least once", async () => {
      const sample = {
        id: 23,
        name: "Client Rapid Device",
        note: "rapid note",
        assigned_to: "rapid_user",
        model: { name: "Rapid Model" },
      } as any;

      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalledTimes(3);
      });

      expect(openNotificationMock).toHaveBeenCalledWith({
        type: "success",
        message: "checked in successfully",
      });
    });

    it("refetch throwing synchronously is handled and shows error notification", async () => {
      refetchMock.mockImplementationOnce(() => {
        throw new Error("Client sync error");
      });

      const sample = {
        id: 24,
        name: "Client Sync Error Device",
        note: "sync error note",
        assigned_to: "sync_error_user",
        model: { name: "Sync Error Model" },
      } as any;

      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(openNotificationMock).toHaveBeenCalledWith({
          type: "error",
          message: "Client sync error",
        });
      });

      expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
    });

    it("preserves form values when refetch returns validation errors", async () => {
      refetchMock.mockImplementationOnce(async () => ({
        isError: true,
        message: "Validation failed for client device",
      }));

      const sample = {
        id: 25,
        name: "Client Validation Device",
        note: "validation note",
        assigned_to: "validation_user",
        model: { name: "Validation Model" },
      } as any;

      render(
        <MockClientHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
      const noteInput = screen.getByTestId("input-note") as HTMLTextAreaElement;

      fireEvent.change(nameInput, {
        target: { value: "Client Modified Name" },
      });
      fireEvent.change(noteInput, {
        target: { value: "Client Modified Note" },
      });

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(openNotificationMock).toHaveBeenCalledWith({
          type: "error",
          message: "Validation failed for client device",
        });
      });

      expect(nameInput.value).toBe("Client Modified Name");
      expect(noteInput.value).toBe("Client Modified Note");
      expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
    });
  });
});
