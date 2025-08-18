import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UploadImage } from "components/elements/uploadImage";

// Mock URL.createObjectURL globally
const mockCreateObjectURL = jest.fn();

describe("UploadImage Component", () => {
  const mockSetFile = jest.fn();
  const defaultProps = {
    file: undefined,
    setFile: mockSetFile,
    id: "test-upload",
  };

  beforeAll(() => {
    window.URL.createObjectURL = mockCreateObjectURL;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue("blob:test-url");
  });

  describe("Initial Rendering", () => {
    it("should render default upload image when no file or URL provided", () => {
      render(<UploadImage {...defaultProps} />);
      const defaultImage = screen.getByRole("img");
      expect(defaultImage).toHaveAttribute("src", "/images/global/upload.png");
    });

    it("should render custom URL image when provided", () => {
      const testUrl = "/custom/image.jpg";
      render(<UploadImage {...defaultProps} url={testUrl} />);
      const urlImage = screen.getByRole("img");
      expect(urlImage).toHaveAttribute("src", testUrl);
    });

    it("should render file input with correct attributes", () => {
      render(<UploadImage {...defaultProps} />);
      const input = screen.getByTestId("test-upload");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "file");
      expect(input).toHaveClass("file");
    });
    it("should render default upload image when no file or URL provided", () => {
      render(<UploadImage {...defaultProps} />);
      const defaultImage = screen.getByRole("img", { hidden: true });
      expect(defaultImage).toHaveAttribute("src", "/images/global/upload.png");
    });
  });

  describe("File Upload Functionality", () => {
    it("should handle file selection", async () => {
      render(<UploadImage {...defaultProps} />);
      const file = new File(["test content"], "test.png", {
        type: "image/png",
      });
      const input = screen.getByTestId("test-upload");

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockSetFile).toHaveBeenCalledWith(file);
      });
    });

    it("should display uploaded image with replace option", () => {
      const file = new File(["test"], "test.png", { type: "image/png" });
      render(<UploadImage {...defaultProps} file={file} />);

      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      expect(screen.getByText("Replace")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty file selection", async () => {
      render(<UploadImage {...defaultProps} />);
      const input = screen.getByTestId("test-upload");

      fireEvent.change(input, { target: { files: [] } });

      await waitFor(() => {
        expect(mockSetFile).not.toHaveBeenCalled();
      });
    });

    it("should handle null file selection", async () => {
      render(<UploadImage {...defaultProps} />);
      const input = screen.getByTestId("test-upload");

      fireEvent.change(input, { target: { files: null } });

      await waitFor(() => {
        expect(mockSetFile).not.toHaveBeenCalled();
      });
    });
  });
});
