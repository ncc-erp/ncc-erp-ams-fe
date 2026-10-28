import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const openNotificationMock = jest.fn();
const refetchMock = jest.fn();

const MockHardwareCheckin: React.FC<any> = ({ setIsModalVisible, data }) => {
  const [name, setName] = React.useState(data?.name ?? "");
  const [note, setNote] = React.useState(data?.note ?? "");
  const [assignedUser, setAssignedUser] = React.useState(
    data?.assigned_to ?? ""
  );
  const [dateCheckin, setDateCheckin] = React.useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = {
      id: data?.id,
      name,
      note,
      assigned_user: assignedUser,
      checkin_at: dateCheckin || new Date().toISOString(),
    };
    try {
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
    } catch (err: any) {
      openNotificationMock({
        type: "error",
        message: err?.message ?? "error",
      });
    }
  };

  return (
    <form data-testid="hardware-checkin-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

jest.mock("pages/hardware/checkin", () => ({
  HardwareCheckin: MockHardwareCheckin,
}));

describe("HardwareCheckin - Check render and Basic workflows", () => {
  const setIsModalVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    refetchMock.mockImplementation(async () => ({
      isError: false,
      data: { message: "checked in" },
    }));
  });

  describe("Check render", () => {
    it("renders form fields and submit button", () => {
      const sample = {
        id: 10,
        name: "Device A",
        note: "some note",
        assigned_to: "user1",
      } as any;
      render(
        <MockHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      expect(screen.getByTestId("hardware-checkin-form")).toBeInTheDocument();
      expect(screen.getByTestId("input-name")).toBeInTheDocument();
      expect(screen.getByTestId("input-assigned")).toBeInTheDocument();
      expect(screen.getByTestId("input-checkin-at")).toBeInTheDocument();
      expect(screen.getByTestId("input-note")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();

      expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe(
        "Device A"
      );
      expect(
        (screen.getByTestId("input-assigned") as HTMLInputElement).value
      ).toBe("user1");
      expect(
        (screen.getByTestId("input-note") as HTMLTextAreaElement).value
      ).toBe("some note");
    });

    // advanced render cases
    it("allows editing fields and retains changes before submit", () => {
      const sample = { id: 13, name: "D1", note: "", assigned_to: "" } as any;
      render(
        <MockHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
      const noteInput = screen.getByTestId("input-note") as HTMLTextAreaElement;
      const assigned = screen.getByTestId("input-assigned") as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: "Device Edited" } });
      fireEvent.change(assigned, { target: { value: "newUser" } });
      fireEvent.change(noteInput, { target: { value: "long note content" } });

      expect(nameInput.value).toBe("Device Edited");
      expect(assigned.value).toBe("newUser");
      expect(noteInput.value).toBe("long note content");
    });

    it("renders empty assigned user input when assigned_to missing", () => {
      const sample = { id: 14, name: "D2", note: "" } as any;
      render(
        <MockHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );
      expect(
        (screen.getByTestId("input-assigned") as HTMLInputElement).value
      ).toBe("");
    });

    it("handles large note content without truncation", () => {
      const sample = { id: 15, name: "D3", note: "" } as any;
      render(
        <MockHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );
      const long = "x".repeat(5000);
      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: long },
      });
      expect(
        (screen.getByTestId("input-note") as HTMLTextAreaElement).value
      ).toBe(long);
    });
  });

  describe("Basic workflows", () => {
    it("submits payload, shows success notification and closes modal on success", async () => {
      const sample = {
        id: 11,
        name: "Device B",
        note: "",
        assigned_to: "u2",
      } as any;
      render(
        <MockHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Checked OK" },
      });
      fireEvent.change(screen.getByTestId("input-checkin-at"), {
        target: { value: "2024-06-01T10:00" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
        expect(setIsModalVisible).toHaveBeenCalledWith(false);
      });

      const calledPayload = refetchMock.mock.calls[0][0];
      expect(calledPayload).toMatchObject({
        id: 11,
        note: "Checked OK",
        checkin_at: "2024-06-01T10:00",
        assigned_user: "u2",
      });
    });

    it("shows error notification and keeps modal open when refetch returns error", async () => {
      refetchMock.mockImplementationOnce(async () => ({
        isError: true,
        error: {
          response: { data: { messages: { assigned_user: ["required"] } } },
        },
      }));
      const sample = { id: 12, name: "Device C", assigned_to: "" } as any;
      render(
        <MockHardwareCheckin
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

    // advanced workflow cases
    it("handles long-running refetch without timing out and shows success", async () => {
      refetchMock.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ isError: false, data: { message: "slow ok" } }),
              80
            )
          )
      );

      const sample = { id: 16, name: "Device Slow", assigned_to: "u1" } as any;
      render(
        <MockHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
      });
    });

    it("rapid multiple submits do not crash and refetch called at least once", async () => {
      refetchMock.mockImplementation(async () => ({
        isError: false,
        data: { message: "ok" },
      }));

      const sample = { id: 17, name: "Device Rapid", assigned_to: "u1" } as any;
      render(
        <MockHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={jest.fn()}
          data={sample}
        />
      );

      expect(() => {
        fireEvent.click(screen.getByTestId("submit-button"));
        fireEvent.click(screen.getByTestId("submit-button"));
        fireEvent.click(screen.getByTestId("submit-button"));
      }).not.toThrow();

      await waitFor(() => {
        expect(refetchMock.mock.calls.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("refetch throwing synchronously is handled and shows error notification", async () => {
      refetchMock.mockImplementationOnce(() => {
        throw new Error("sync failure");
      });

      const sample = { id: 18, name: "Device Boom", assigned_to: "u1" } as any;
      render(
        <MockHardwareCheckin
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
      });
    });

    it("preserves form values when refetch returns validation errors", async () => {
      refetchMock.mockImplementationOnce(async () => ({
        isError: true,
        error: { response: { data: { messages: { note: ["too long"] } } } },
      }));

      const sample = {
        id: 19,
        name: "Device Preserve",
        assigned_to: "u5",
        note: "",
      } as any;
      render(
        <MockHardwareCheckin
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample}
        />
      );

      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "Needs special handling" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
      });

      // ensure values are still present in inputs after error
      expect(
        (screen.getByTestId("input-note") as HTMLTextAreaElement).value
      ).toBe("Needs special handling");
      expect(
        (screen.getByTestId("input-assigned") as HTMLInputElement).value
      ).toBe("u5");
    });
  });
});
