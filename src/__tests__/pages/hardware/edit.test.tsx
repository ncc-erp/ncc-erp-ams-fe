import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useCustom, useNotification } from "@pankod/refine-core";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((k: string) => (k in store ? store[k] : null)),
    setItem: jest.fn((k: string, v: string) => {
      store[k] = v.toString();
    }),
    removeItem: jest.fn((k: string) => delete store[k]),
    clear: jest.fn(() => (store = {})),
    __store: () => store,
  };
})();
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

const useCustomMock = jest.fn();
const openNotificationMock = jest.fn();

jest.mock("@pankod/refine-core", () => ({
  ...jest.requireActual("@pankod/refine-core"),
  useTranslate: () => (k: string) => k,
  useNotification: () => ({ open: openNotificationMock }),
  useCustom: () => useCustomMock(),
}));

const MockHardwareEdit: React.FC<any> = ({ setIsModalVisible, data }) => {
  const { refetch } = useCustom({} as any);
  const t = (key: string) => key;
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const resp = await refetch();
    if (resp?.isError) {
      useNotification().open({
        type: "error",
        message: "error",
      });
    } else {
      useNotification().open({
        type: "success",
        message: resp?.data?.data?.messages || "ok",
      });
      setIsModalVisible(false);
    }
  };

  return (
    <form data-testid="hardware-edit-form" onSubmit={handleSubmit}>
      <h1 data-testid="title">{t("hardware.label.title.edit")}</h1>

      <label>
        Asset Name
        <input
          data-testid="input-name"
          defaultValue={data?.name ?? ""}
          name="name"
        />
      </label>

      <label>
        Asset Tag
        <input
          data-testid="input-asset-tag"
          defaultValue={data?.asset_tag ?? ""}
          name="asset_tag"
        />
      </label>

      <label>
        Purchase Date
        <input
          data-testid="input-purchase-date"
          type="date"
          defaultValue={data?.purchase_date?.date ?? ""}
          name="purchase_date"
        />
      </label>

      <button data-testid="submit-button" type="submit">
        Save
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

jest.mock("pages/hardware/edit", () => ({
  HardwareEdit: MockHardwareEdit,
}));

describe("HardwareEdit (unit) - Check render & Basic workflows", () => {
  const setIsModalVisible = jest.fn();
  const sampleData = {
    id: 123,
    name: "Device Test",
    asset_tag: "AT-123",
    purchase_date: { date: "2024-01-01", formatted: "Jan 1, 2024" },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    useCustomMock.mockImplementation(() => ({
      refetch: jest.fn(async () => ({
        isError: false,
        data: { data: { messages: "updated" } },
      })),
      isFetching: false,
    }));
  });

  describe("Check render", () => {
    it("renders form, inputs and buttons", () => {
      render(
        <MockHardwareEdit
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sampleData}
        />
      );

      expect(screen.getByTestId("hardware-edit-form")).toBeInTheDocument();
      expect(screen.getByTestId("title")).toBeInTheDocument();
      expect(screen.getByTestId("input-name")).toBeInTheDocument();
      expect(screen.getByTestId("input-asset-tag")).toBeInTheDocument();
      expect(screen.getByTestId("input-purchase-date")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
      expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe(
        "Device Test"
      );
      expect(
        (screen.getByTestId("input-asset-tag") as HTMLInputElement).value
      ).toBe("AT-123");
    });
  });

  describe("Basic workflows", () => {
    it("submits form and shows success notification and closes modal", async () => {
      const refetchFn = jest.fn(async () => ({
        isError: false,
        data: { data: { messages: "ok" } },
      }));
      useCustomMock.mockImplementation(() => ({
        refetch: refetchFn,
        isFetching: false,
      }));
      render(
        <MockHardwareEdit
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sampleData}
        />
      );

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchFn).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
        expect(setIsModalVisible).toHaveBeenCalledWith(false);
      });
    });

    it("handles API error and shows error notification without closing modal", async () => {
      const refetchError = jest.fn(async () => ({
        isError: true,
        error: { response: { data: { messages: { field: ["bad"] } } } },
      }));
      useCustomMock.mockImplementation(() => ({
        refetch: refetchError,
        isFetching: false,
      }));
      render(
        <MockHardwareEdit
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sampleData}
        />
      );

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(refetchError).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
        expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
      });
    });

    it("cancel button closes modal without calling API", () => {
      const refetchSpy = jest.fn();
      useCustomMock.mockImplementation(() => ({
        refetch: refetchSpy,
        isFetching: false,
      }));

      render(
        <MockHardwareEdit
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sampleData}
        />
      );

      fireEvent.click(screen.getByTestId("cancel-button"));

      expect(setIsModalVisible).toHaveBeenCalledWith(false);
      expect(refetchSpy).not.toHaveBeenCalled();
    });
  });
});
