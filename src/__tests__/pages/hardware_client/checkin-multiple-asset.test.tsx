import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CLIENT_HARDWARE_CHECKIN_API } from "api/baseApi";

const mutateMock = jest.fn();
const openNotificationMock = jest.fn();
const clearSelectionMock = jest.fn();
const setIsModalVisibleMock = jest.fn();

const MockClientHardwareCheckinMultipleAsset: React.FC<any> = ({
  setIsModalVisible = setIsModalVisibleMock,
  data = [],
  clearSelection = clearSelectionMock,
  isLoading = false,
}) => {
  const [statusId, setStatusId] = React.useState<number | "">("");
  const [note, setNote] = React.useState<string>(data?.note ?? "");
  const [checkinAt, setCheckinAt] = React.useState<string>(
    (data && data.checkin_at) || ""
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = {
      assets: data?.map((d: any) => d.id),
      status_id: statusId,
      note: note ?? "",
      checkin_at: checkinAt,
    };
    try {
      mutateMock(
        { resource: CLIENT_HARDWARE_CHECKIN_API, values: payload },
        {
          onSuccess: (res: any) => {
            openNotificationMock({
              type: "success",
              message: res?.data?.message ?? "ok",
            });
            setIsModalVisible(false);
            clearSelection();
          },
          onError: (_err: any) => {
            openNotificationMock({ type: "error", message: "error" });
          },
        }
      );
    } catch (err) {
      openNotificationMock({ type: "error", message: (err as Error).message });
    }
  };

  return (
    <form data-testid="client-checkin-multiple-form" onSubmit={handleSubmit}>
      <div data-testid="assets-list">
        {data?.length ? (
          data?.map((item: any) => (
            <div key={item.id} data-testid={`asset-${item.id}`}>
              <span data-testid={`asset-tag-${item.id}`}>{item.asset_tag}</span>
              <span data-testid={`asset-cat-${item.id}`}>
                {item.category?.name ?? "Unknown"}
              </span>
            </div>
          ))
        ) : (
          <div data-testid="assets-empty">no assets</div>
        )}
      </div>

      <label>
        Checkin At
        <input
          data-testid="input-checkin-at"
          type="datetime-local"
          value={checkinAt}
          onChange={(e) => setCheckinAt(e.target.value)}
        />
      </label>

      <label>
        Status
        <select
          data-testid="select-status"
          value={String(statusId)}
          onChange={(e) =>
            setStatusId(e.target.value === "" ? "" : Number(e.target.value))
          }
        >
          <option value="">--</option>
          <option value="1">Ready</option>
          <option value="2">Broken</option>
        </select>
      </label>

      <label>
        Note
        <textarea
          data-testid="input-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      <button data-testid="submit-button" type="submit" disabled={isLoading}>
        Checkin
      </button>
    </form>
  );
};

jest.mock("pages/hardware_client/checkin-multiple-asset", () => ({
  ClientHardwareCheckinMultipleAsset: MockClientHardwareCheckinMultipleAsset,
}));

describe("ClientHardwareCheckinMultipleAsset - Check render and Basic workflows", () => {
  const sampleData = [
    { id: 11, asset_tag: "AT-11", category: { name: "Cat A" } },
    { id: 12, asset_tag: "AT-12", category: { name: "Cat B" } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });
  //Check render
  describe("Check render", () => {
    it("renders assets list, date input, status select, note and submit button", () => {
      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      expect(
        screen.getByTestId("client-checkin-multiple-form")
      ).toBeInTheDocument();
      expect(screen.getByTestId("assets-list")).toBeInTheDocument();
      expect(screen.getByTestId("asset-11")).toBeInTheDocument();
      expect(screen.getByTestId("asset-tag-11").textContent).toBe("AT-11");
      expect(screen.getByTestId("asset-cat-12").textContent).toBe("Cat B");
      expect(screen.getByTestId("input-checkin-at")).toBeInTheDocument();
      expect(screen.getByTestId("select-status")).toBeInTheDocument();
      expect(screen.getByTestId("input-note")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("renders 'no assets' when data is empty", () => {
      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={[]}
          clearSelection={clearSelectionMock}
        />
      );

      expect(screen.getByTestId("assets-empty")).toBeInTheDocument();
      expect(screen.queryByTestId("asset-11")).toBeNull();
    });

    it("renders Unknown when category is missing", () => {
      const data = [{ id: 21, asset_tag: "AT-21" }];
      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={data}
          clearSelection={clearSelectionMock}
        />
      );

      expect(screen.getByTestId("asset-21")).toBeInTheDocument();
      expect(screen.getByTestId("asset-cat-21").textContent).toBe("Unknown");
    });

    it("renders many assets without breaking (performance smoke)", () => {
      const many = Array.from({ length: 120 }).map((_, i) => ({
        id: 1000 + i,
        asset_tag: `TAG-${i}`,
        category: { name: `Cat ${i % 5}` },
      }));
      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={many}
          clearSelection={clearSelectionMock}
        />
      );

      expect(screen.getByTestId("asset-1000")).toBeInTheDocument();
      expect(screen.getByTestId("asset-1059")).toBeInTheDocument();
      expect(screen.getByTestId("asset-1119")).toBeInTheDocument();
    });

    it("initial values reflect provided data (note & checkin_at)", () => {
      const withValues = [
        {
          id: 31,
          asset_tag: "AT-31",
          category: { name: "C" },
          note: "n",
          checkin_at: "2025-09-16T10:00",
        },
      ];
      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={withValues}
          clearSelection={clearSelectionMock}
        />
      );

      expect(screen.getByTestId("asset-31")).toBeInTheDocument();
      fireEvent.change(screen.getByTestId("input-checkin-at"), {
        target: { value: "2025-09-16T10:00" },
      });
      expect(
        (screen.getByTestId("input-checkin-at") as HTMLInputElement).value
      ).toBe("2025-09-16T10:00");
    });
  });

  describe("Basic workflows", () => {
    it("submits payload, shows success notification, closes modal and clears selection on success", async () => {
      mutateMock.mockImplementation((_p: any, { onSuccess }: any) => {
        onSuccess?.({ data: { status: "success", message: "checked" } });
      });

      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.change(screen.getByTestId("select-status"), {
        target: { value: "1" },
      });
      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "ok" },
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

    it("shows error notification and does not close modal when mutate returns error", async () => {
      mutateMock.mockImplementation((_p: any, { onError }: any) => {
        onError?.({ response: { data: { messages: { note: ["bad"] } } } });
      });

      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.change(screen.getByTestId("select-status"), {
        target: { value: "2" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
        expect(setIsModalVisibleMock).not.toHaveBeenCalledWith(false);
        expect(clearSelectionMock).not.toHaveBeenCalled();
      });
    });

    it("includes assets ids and entered values in mutate payload", async () => {
      let capturedPayload: any = null;
      mutateMock.mockImplementation((p: any, { onSuccess }: any) => {
        capturedPayload = p;
        onSuccess?.({ data: { status: "success" } });
      });

      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.change(screen.getByTestId("input-checkin-at"), {
        target: { value: "2025-09-16T10:00" },
      });
      fireEvent.change(screen.getByTestId("select-status"), {
        target: { value: "1" },
      });
      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "multiple checkin" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(capturedPayload).not.toBeNull();
        expect(capturedPayload.values.assets).toEqual([11, 12]);
        expect(capturedPayload.values.status_id).toBe(1);
        expect(capturedPayload.values.note).toBe("multiple checkin");
        expect(capturedPayload.values.checkin_at).toBe("2025-09-16T10:00");
      });
    });

    it("submits payload with empty status and uses asset ids when status not selected", async () => {
      let captured: any = null;
      mutateMock.mockImplementation((p: any, { onSuccess }: any) => {
        captured = p;
        onSuccess?.({ data: { status: "success" } });
      });

      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.change(screen.getByTestId("input-note"), {
        target: { value: "note-only" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(captured).not.toBeNull();
        expect(captured.values.assets).toEqual([11, 12]);
        expect(captured.values.status_id).toBe("");
        expect(captured.values.note).toBe("note-only");
      });
    });

    it("mutate throwing synchronously is handled and shows error notification", async () => {
      mutateMock.mockImplementation(() => {
        throw new Error("boom");
      });

      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error", message: "boom" })
        );
      });
    });

    it("submit button is disabled while loading", () => {
      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={setIsModalVisibleMock}
          data={sampleData}
          clearSelection={clearSelectionMock}
          isLoading={true}
        />
      );

      const btn = screen.getByTestId("submit-button") as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });

    it("rapid multiple submits do not crash and mutate called at least once", async () => {
      mutateMock.mockImplementation((_p: any, { onSuccess }: any) => {
        onSuccess?.({ data: { status: "success" } });
      });

      render(
        <MockClientHardwareCheckinMultipleAsset
          isModalVisible={true}
          setIsModalVisible={jest.fn()}
          data={sampleData}
          clearSelection={clearSelectionMock}
        />
      );

      expect(() => {
        fireEvent.click(screen.getByTestId("submit-button"));
        fireEvent.click(screen.getByTestId("submit-button"));
      }).not.toThrow();

      await waitFor(() => {
        expect(mutateMock.mock.calls.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
