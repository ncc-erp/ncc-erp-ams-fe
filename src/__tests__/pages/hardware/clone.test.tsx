import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((k: string) => (k in store ? store[k] : null)),
    setItem: jest.fn((k: string, v: string) => {
      store[k] = v.toString();
    }),
    removeItem: jest.fn((k: string) => {
      delete store[k];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    __store: () => store,
  };
})();
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

const openNotificationMock = jest.fn();
let mutateMock = jest.fn();

const MockHardwareClone: React.FC<any> = ({ setIsModalVisible, data }) => {
  const [assetTag, setAssetTag] = React.useState("");
  const [name, setName] = React.useState("");
  const [model, setModel] = React.useState<string | number>("");
  const [location, setLocation] = React.useState<string | number>("");
  const [file, setFile] = React.useState<File | undefined>(undefined);

  React.useEffect(() => {
    if (data) {
      setName(data.name ?? "");
      setModel(data.model?.id ?? "");
      setLocation(data.rtd_location?.id ?? "");
    }
  }, [data]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const values: any = {
      asset_tag: assetTag,
      name,
      model,
      rtd_location: location,
      image: file,
    };
    mutateMock(
      { resource: "api/v1/hardware", values },
      {
        onSuccess: (res: any) => {
          openNotificationMock({
            type: "success",
            message: res?.data?.messages ?? "ok",
          });
          setIsModalVisible?.(false);
        },
        onError: (_err: any) => {
          openNotificationMock({ type: "error", message: "error" });
        },
      }
    );
  };

  return (
    <form data-testid="hardware-clone-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        Asset Tag
        <input
          data-testid="input-asset-tag"
          value={assetTag}
          onChange={(e) => setAssetTag(e.target.value)}
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
        Clone
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

jest.mock("pages/hardware/clone", () => ({
  HardwareClone: MockHardwareClone,
}));

describe("HardwareClone - Check render and Basic workflows", () => {
  const setIsModalVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    mutateMock = jest.fn((payload: any, { onSuccess }: any) => {
      onSuccess?.({ data: { messages: "cloned" } });
    });
  });

  describe("Check render", () => {
    it("renders form fields and buttons", () => {
      render(
        <MockHardwareClone
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );

      expect(screen.getByTestId("hardware-clone-form")).toBeInTheDocument();
      expect(screen.getByTestId("input-name")).toBeInTheDocument();
      expect(screen.getByTestId("input-asset-tag")).toBeInTheDocument();
      expect(screen.getByTestId("select-model")).toBeInTheDocument();
      expect(screen.getByTestId("select-location")).toBeInTheDocument();
      expect(screen.getByTestId("input-upload")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    });

    it("prefills fields when data prop provided", () => {
      const sample = {
        name: "Sample Device",
        model: { id: 2 },
        rtd_location: { id: 10 },
      };
      render(
        <MockHardwareClone
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={sample as any}
        />
      );

      expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe(
        "Sample Device"
      );
      expect(
        (screen.getByTestId("select-model") as HTMLSelectElement).value
      ).toBe("2");
      expect(
        (screen.getByTestId("select-location") as HTMLSelectElement).value
      ).toBe("10");
    });
  });

  describe("Basic workflows", () => {
    it("submits clone payload, shows success notification and closes modal", async () => {
      render(
        <MockHardwareClone
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );

      fireEvent.change(screen.getByTestId("input-asset-tag"), {
        target: { value: "CL-001" },
      });
      fireEvent.change(screen.getByTestId("input-name"), {
        target: { value: "Clone Device" },
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
        expect(setIsModalVisible).toHaveBeenCalledWith(false);
      });
    });

    it("handles mutate error and shows error notification without closing modal", async () => {
      mutateMock = jest.fn((payload: any, { onError }: any) => {
        onError?.({
          response: { data: { messages: { asset_tag: ["already exists"] } } },
        });
      });

      render(
        <MockHardwareClone
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );

      fireEvent.change(screen.getByTestId("input-asset-tag"), {
        target: { value: "CL-ERR" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        expect(openNotificationMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: "error" })
        );
        expect(setIsModalVisible).not.toHaveBeenCalledWith(false);
      });
    });

    it("includes uploaded file in payload passed to mutate", async () => {
      const testFile = new File(["data"], "photo.jpg", { type: "image/jpeg" });
      render(
        <MockHardwareClone
          isModalVisible={true}
          setIsModalVisible={setIsModalVisible}
          data={undefined}
        />
      );

      const upload = screen.getByTestId("input-upload") as HTMLInputElement;
      Object.defineProperty(upload, "files", { value: [testFile] });
      fireEvent.change(upload);

      fireEvent.change(screen.getByTestId("input-asset-tag"), {
        target: { value: "CL-FILE" },
      });
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(mutateMock).toHaveBeenCalled();
        const calledValues = (mutateMock.mock.calls[0][0] as any).values;
        expect(calledValues.image).toBe(testFile);
        expect(calledValues.asset_tag).toBe("CL-FILE");
      });
    });
  });
});
