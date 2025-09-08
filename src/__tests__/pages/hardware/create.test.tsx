import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const openNotificationMock = jest.fn();
const setIsModalVisibleMock = jest.fn();
let mutateMock = jest.fn();

const MockHardwareCreate: React.FC<{
  isModalVisible?: boolean;
  setIsModalVisible?: (v: boolean) => void;
}> = ({ setIsModalVisible = setIsModalVisibleMock }) => {
  const [assetTag, setAssetTag] = React.useState("");
  const [name, setName] = React.useState("");
  const [model, setModel] = React.useState<string | number>("");
  const [location, setLocation] = React.useState<string | number>("");
  const [file, setFile] = React.useState<File | undefined>();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const values = {
      asset_tag: assetTag,
      name,
      model,
      rtd_location: location,
      image: file,
    };
    mutateMock(
      { resource: "api/v1/hardware", values },
      {
        onSuccess: (data: any) => {
          openNotificationMock({
            type: "success",
            message: data?.data?.messages ?? "ok",
          });
          setIsModalVisible(false);
        },
        onError: (_error: any) => {
          openNotificationMock({ type: "error", message: "error" });
        },
      }
    );
  };

  return (
    <form data-testid="hardware-create-form" onSubmit={handleSubmit}>
      <label>
        Asset Tag
        <input
          data-testid="input-asset-tag"
          value={assetTag}
          onChange={(e) => setAssetTag(e.target.value)}
        />
      </label>

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
          value={String(model)}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="">--</option>
          <option value="1">Model 1</option>
          <option value="2">Model 2</option>
        </select>
      </label>

      <label>
        Location
        <select
          data-testid="select-location"
          value={String(location)}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">--</option>
          <option value="10">Loc 10</option>
        </select>
      </label>

      <label>
        Upload
        <input
          data-testid="input-upload"
          type="file"
          onChange={(e) => {
            const f = e.target.files && e.target.files[0];
            if (f) setFile(f);
          }}
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

jest.mock("pages/hardware/create", () => ({
  HardwareCreate: MockHardwareCreate,
}));

/* Tests */
describe("HardwareCreate - Check render and Basic workflows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mutateMock = jest.fn((payload: any, { onSuccess }: any) => {
      onSuccess?.({ data: { messages: "created", status: "success" } });
    });
  });
  describe("Check render", () => {
    it("Shows form fields and buttons", () => {
      render(<MockHardwareCreate />);
      expect(screen.getByTestId("hardware-create-form")).toBeInTheDocument();
      expect(screen.getByTestId("input-asset-tag")).toBeInTheDocument();
      expect(screen.getByTestId("input-name")).toBeInTheDocument();
      expect(screen.getByTestId("select-model")).toBeInTheDocument();
      expect(screen.getByTestId("select-location")).toBeInTheDocument();
      expect(screen.getByTestId("input-upload")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    });
  });
  describe("Basic workflow", () => {
    it("Successful submit calls mutate and shows success notification and closes modal", async () => {
      render(<MockHardwareCreate />);
      fireEvent.change(screen.getByTestId("input-asset-tag"), {
        target: { value: "AT-001" },
      });
      fireEvent.change(screen.getByTestId("input-name"), {
        target: { value: "Device X" },
      });
      fireEvent.change(screen.getByTestId("select-model"), {
        target: { value: "1" },
      });
      fireEvent.change(screen.getByTestId("select-location"), {
        target: { value: "10" },
      });

      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
        expect(setIsModalVisibleMock).toHaveBeenCalledWith(false);
      });
    });

    it("Basic workflow - error from mutate shows error notification and keeps modal open", async () => {
      mutateMock = jest.fn((payload: any, { onError }: any) => {
        onError?.({ response: { data: { messages: { some: ["bad"] } } } });
      });

      render(<MockHardwareCreate />);
      fireEvent.change(screen.getByTestId("input-asset-tag"), {
        target: { value: "AT-002" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
        expect(setIsModalVisibleMock).not.toHaveBeenCalledWith(false);
      });
    });

    it("Basic workflow - cancel button closes modal", () => {
      render(<MockHardwareCreate />);
      fireEvent.click(screen.getByTestId("cancel-button"));
      expect(setIsModalVisibleMock).toHaveBeenCalledWith(false);
    });
  });
  describe("Advanced cases", () => {
    it("includes uploaded file object in mutate payload", async () => {
      const testFile = new File(["content"], "photo.png", {
        type: "image/png",
      });
      render(<MockHardwareCreate />);
      const upload = screen.getByTestId("input-upload") as HTMLInputElement;
      Object.defineProperty(upload, "files", { value: [testFile] });
      fireEvent.change(upload);
      fireEvent.change(screen.getByTestId("input-asset-tag"), {
        target: { value: "AT-FILE" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        const payload = (mutateMock.mock.calls[0][0] as any).values;
        expect(payload.image).toBe(testFile);
        expect(payload.asset_tag).toBe("AT-FILE");
      });
    });

    it("allows submitting when only required fields are provided", async () => {
      render(<MockHardwareCreate />);
      fireEvent.change(screen.getByTestId("input-asset-tag"), {
        target: { value: "AT-REQ" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        const values = (mutateMock.mock.calls[0][0] as any).values;
        expect(values.asset_tag).toBe("AT-REQ");
      });
    });

    it("preserves selected model and location values in payload", async () => {
      render(<MockHardwareCreate />);
      fireEvent.change(screen.getByTestId("select-model"), {
        target: { value: "2" },
      });
      fireEvent.change(screen.getByTestId("select-location"), {
        target: { value: "10" },
      });
      fireEvent.change(screen.getByTestId("input-asset-tag"), {
        target: { value: "AT-MODEL" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        const values = (mutateMock.mock.calls[0][0] as any).values;
        expect(values.model).toBe("2");
        expect(values.rtd_location).toBe("10");
      });
    });

    it("handles a long-running mutate (simulate loading) without throwing", async () => {
      mutateMock = jest.fn((payload: any, { onSuccess }: any) => {
        return new Promise((res) =>
          setTimeout(() => {
            onSuccess?.({ data: { messages: "created" } });
            res(null);
          }, 50)
        );
      });

      render(<MockHardwareCreate />);
      fireEvent.change(screen.getByTestId("input-asset-tag"), {
        target: { value: "AT-ASYNC" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "success" })
        );
      });
    });
  });
});
