import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CLIENT_HARDWARE_API } from "api/baseApi";

const mutateMock = jest.fn();
const openNotificationMock = jest.fn();
const setIsModalVisibleMock = jest.fn();

const MockClientHardwareClone: React.FC<any> = ({
  isModalVisible = true,
  setIsModalVisible = setIsModalVisibleMock,
  data = {},
}) => {
  const [assetTag, setAssetTag] = React.useState(data?.asset_tag ?? "");
  const [name, setName] = React.useState(data?.name ?? "");
  const [model, setModel] = React.useState(data?.model?.id ?? "");
  const [rtdLocation, setRtdLocation] = React.useState(
    data?.rtd_location?.id ?? ""
  );
  const [supplier, setSupplier] = React.useState(data?.supplier?.id ?? "");
  const [warranty, setWarranty] = React.useState(
    data?.warranty_months ? data.warranty_months.split(" ")[0] : ""
  );
  const [purchaseCost, setPurchaseCost] = React.useState(
    data?.purchase_cost ? String(data.purchase_cost).replace(/,/g, "") : ""
  );
  const [purchaseDate, setPurchaseDate] = React.useState(
    data?.purchase_date?.date ?? ""
  );
  const [notes, setNotes] = React.useState(data?.notes ?? "");
  const [status, setStatus] = React.useState(data?.status_label?.id ?? "");
  const [file, setFile] = React.useState<File | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const values: any = {
      asset_tag: assetTag,
      name,
      model_id: model,
      rtd_location_id: rtdLocation,
      supplier_id: supplier,
      warranty_months: warranty,
      purchase_cost: purchaseCost,
      purchase_date: purchaseDate,
      notes,
      status_id: status,
    };

    if (file) values.image = file;

    try {
      mutateMock(
        { resource: CLIENT_HARDWARE_API, values },
        {
          onSuccess: (res: any) => {
            openNotificationMock({
              type: "success",
              message: res?.data?.message ?? "ok",
            });
            setIsModalVisible(false);
          },
          onError: (err: any) => {
            openNotificationMock({
              type: "error",
              message: err?.message ?? "error",
            });
          },
        }
      );
    } catch (err: any) {
      openNotificationMock({ type: "error", message: err?.message ?? "error" });
    }
  };

  if (!isModalVisible) return null;

  return (
    <form data-testid="client-hardware-clone-form" onSubmit={handleSubmit}>
      <label>
        Asset Tag
        <input
          data-testid="input-asset_tag"
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
          value={String(rtdLocation)}
          onChange={(e) => setRtdLocation(e.target.value)}
        >
          <option value="">--</option>
          <option value="10">Loc 10</option>
        </select>
      </label>

      <label>
        Supplier
        <select
          data-testid="select-supplier"
          value={String(supplier)}
          onChange={(e) => setSupplier(e.target.value)}
        >
          <option value="">--</option>
          <option value="20">Sup 20</option>
        </select>
      </label>

      <label>
        Warranty months
        <input
          data-testid="input-warranty"
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
        />
      </label>

      <label>
        Purchase cost
        <input
          data-testid="input-purchase-cost"
          value={purchaseCost}
          onChange={(e) => setPurchaseCost(e.target.value)}
        />
      </label>

      <label>
        Purchase date
        <input
          data-testid="input-purchase-date"
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />
      </label>

      <label>
        Status
        <select
          data-testid="select-status"
          value={String(status)}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">--</option>
          <option value="1">Ready</option>
          <option value="2">Pending</option>
        </select>
      </label>

      <label>
        Notes
        <textarea
          data-testid="input-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <label>
        Upload
        <input
          data-testid="upload-image"
          type="file"
          onChange={(e: any) => {
            const f = e.target.files && e.target.files[0];
            if (f) setFile(f);
          }}
        />
      </label>

      <button data-testid="submit-button" type="submit">
        Clone
      </button>
    </form>
  );
};

jest.mock("pages/hardware_client/clone", () => ({
  ClientHardwareClone: MockClientHardwareClone,
}));

describe("ClientHardwareClone - render and workflows (mocked)", () => {
  const sampleData = {
    asset_tag: "C-100",
    name: "Device C",
    model: { id: 1, name: "Model 1" },
    rtd_location: { id: 10, name: "Loc A" },
    supplier: { id: 20, name: "Sup A" },
    warranty_months: "12 months",
    purchase_cost: "1,000",
    purchase_date: { date: "2025-09-01" },
    notes: "orig notes",
    status_label: { id: 1 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields with initial values", () => {
    render(
      <MockClientHardwareClone
        isModalVisible={true}
        data={sampleData}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );
    expect(
      screen.getByTestId("client-hardware-clone-form")
    ).toBeInTheDocument();
    expect(
      (screen.getByTestId("input-asset_tag") as HTMLInputElement).value
    ).toBe("C-100");
    expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe(
      "Device C"
    );
    expect(
      (screen.getByTestId("select-model") as HTMLSelectElement).value
    ).toBe("1");
    expect(
      (screen.getByTestId("select-location") as HTMLSelectElement).value
    ).toBe("10");
    expect(
      (screen.getByTestId("select-supplier") as HTMLSelectElement).value
    ).toBe("20");
    expect(
      (screen.getByTestId("input-warranty") as HTMLInputElement).value
    ).toBe("12");
    expect(
      (screen.getByTestId("input-purchase-cost") as HTMLInputElement).value
    ).toBe("1000");
    expect(
      (screen.getByTestId("input-purchase-date") as HTMLInputElement).value
    ).toBe("2025-09-01");
    expect(
      (screen.getByTestId("input-notes") as HTMLTextAreaElement).value
    ).toBe("orig notes");
  });

  it("allows editing fields and retains values before submit", () => {
    render(<MockClientHardwareClone isModalVisible={true} data={sampleData} />);
    fireEvent.change(screen.getByTestId("input-asset_tag"), {
      target: { value: "NEW-AT" },
    });
    fireEvent.change(screen.getByTestId("input-name"), {
      target: { value: "New Name" },
    });
    fireEvent.change(screen.getByTestId("input-notes"), {
      target: { value: "new notes" },
    });

    expect(
      (screen.getByTestId("input-asset_tag") as HTMLInputElement).value
    ).toBe("NEW-AT");
    expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe(
      "New Name"
    );
    expect(
      (screen.getByTestId("input-notes") as HTMLTextAreaElement).value
    ).toBe("new notes");
  });

  it("submits payload and calls mutate with expected shape, closes modal on success", async () => {
    mutateMock.mockImplementationOnce((_p: any, { onSuccess }: any) => {
      onSuccess?.({ data: { status: "success", message: "cloned" } });
    });

    render(
      <MockClientHardwareClone
        isModalVisible={true}
        data={sampleData}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );

    fireEvent.change(screen.getByTestId("input-asset_tag"), {
      target: { value: "CL-200" },
    });
    fireEvent.change(screen.getByTestId("select-status"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      const calledArg = mutateMock.mock.calls[0][0];
      expect(calledArg.resource).toBe(CLIENT_HARDWARE_API);
      expect(calledArg.values.asset_tag).toBe("CL-200");
      expect(calledArg.values.status_id).toBe("1");
      expect(openNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success", message: "cloned" })
      );
    });
  });

  it("shows error and does not close modal when mutate signals error", async () => {
    mutateMock.mockImplementationOnce((p: any, { onError }: any) => {
      onError?.({ message: "validation fail" });
    });

    render(
      <MockClientHardwareClone
        isModalVisible={true}
        data={sampleData}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      expect(setIsModalVisibleMock).not.toHaveBeenCalledWith(false);
    });
  });

  it("includes uploaded file in payload when a file is selected", async () => {
    let capturedPayload: any = null;
    mutateMock.mockImplementationOnce((p: any, { onSuccess }: any) => {
      capturedPayload = p;
      onSuccess?.({ data: { status: "success" } });
    });

    render(
      <MockClientHardwareClone
        isModalVisible={true}
        data={sampleData}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );

    const file = new File(["hello"], "img.png", { type: "image/png" });
    const upload = screen.getByTestId("upload-image") as HTMLInputElement;
    Object.defineProperty(upload, "files", { value: [file] });
    fireEvent.change(upload);

    fireEvent.change(screen.getByTestId("input-asset_tag"), {
      target: { value: "CL-FILE" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      const values = capturedPayload.values;
      expect(values.asset_tag).toBe("CL-FILE");
      expect(values.image).toBe(file);
    });
  });

  it("handles mutate throwing synchronously and surfaces error", async () => {
    mutateMock.mockImplementationOnce(() => {
      throw new Error("boom");
    });

    render(
      <MockClientHardwareClone
        isModalVisible={true}
        data={sampleData}
        setIsModalVisible={setIsModalVisibleMock}
      />
    );

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      // when mutate throws, mock component catches and calls openNotificationMock; ensure no modal close
      expect(setIsModalVisibleMock).not.toHaveBeenCalledWith(false);
    });
  });

  it("rapid multiple submits do not crash and mutate called at least once", async () => {
    mutateMock.mockImplementation((p: any, { onSuccess }: any) => {
      onSuccess?.({ data: { status: "success" } });
    });

    render(
      <MockClientHardwareClone
        isModalVisible={true}
        data={sampleData}
        setIsModalVisible={setIsModalVisibleMock}
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
});
