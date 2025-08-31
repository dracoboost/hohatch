import {act, fireEvent, render, screen, waitFor, within} from "@testing-library/react";
import {useMediaQuery} from "react-responsive";
import {toast} from "sonner";

import MainScreen from "@/app/page";

jest.mock("@/config/consts", () => ({
  get I18N() {
    return {
      en: mockLangData,
      ja: mockLangData,
    };
  },
}));

const mockLangData = {
  settings_window_title: "Settings",
  back_btn: "Back",
  language_setting: "Language",
  sk_folder_path_title: "Special K Folder Path",
  select_sk_folder: "Browse",
  download_sk: "Download Special K",
  sk_folder_invalid: "Invalid: SKIF.exe not found or path does not exist.",
  texconv_path_title: "Texconv Executable Path",
  select_texconv_file: "Browse",
  texconv_description:
    "Texconv is a command-line tool by Microsoft for converting image formats, especially DDS textures.",
  download_texconv: "Download Texconv",
  texconv_download_success: "Texconv downloaded successfully.",
  texconv_download_fail: "Failed to download Texconv.",
  texconv_path_invalid: "Invalid: File not found or not executable.",
  dds_to_jpg_res_setting: "DDS to JPG Output Resolution",
  dds_to_jpg_height_label: "Image Height",
  dds_to_jpg_width_label: "Image Width (auto-calculated)",
  invalid_resolution_input: "Invalid resolution input. Please enter a positive integer for height.",
  settings_saved: "Settings saved.",
  error: "Error",
  processing: "Processing...",
  replace_conversion_complete: "Replacement complete!",
  delete_success: "Delete successful!",
  special_k_download_success: "Special K downloaded successfully.",
  dumped_images: "Dumped Images",
  injected_images: "Injected Images",
  no_dump_images: "No dumped images found.",
  no_inject_images: "No injected images found.",
  batch_dump_jpg_complete: "Conversion complete!",
  batch_delete_success: "Batch delete successful.",
  download_complete: "Download complete!",
  downloading_selected_images: "Downloading selected images...",
  dump_folder: "Open Dump Folder",
  inject_folder: "Open Inject Folder",
};

const mockSettings = {
  language: "en",
  last_image_dir: "/mock/path",
  special_k_folder_path: "/mock/sk_path",
  texconv_executable_path: "/mock/texconv.exe",
  output_height: 1024,
  output_width: 874,
};

const mockDumpedImages = [
  {
    src: "", // Changed to empty string
    alt: "dumped_image_1.dds",
    path: "/dump/dumped_image_1.dds",
    width: 100,
    height: 100,
  },
  {
    src: "", // Changed to empty string
    alt: "dumped_image_2.dds",
    path: "/dump/dumped_image_2.dds",
    width: 100,
    height: 100,
  },
];

const mockInjectedImages = [
  {
    src: "", // Changed to empty string
    alt: "injected_image_1.dds",
    path: "/inject/injected_image_1.dds",
    width: 100,
    height: 100,
  },
];

describe("MainScreen", () => {
  let mockedApi: any;

  beforeEach(() => {
    // Mock window.pywebview directly and assign to mockedApi
    window.pywebview = {
      api: {
        get_settings: jest.fn().mockResolvedValue(mockSettings),
        get_language_data: jest.fn().mockResolvedValue(mockLangData),
        get_image_list: jest.fn().mockImplementation(async (folderType: string) => {
          if (folderType === "dump") {
            return Promise.resolve({
              success: true,
              images: mockDumpedImages,
            });
          }
          if (folderType === "inject") {
            return Promise.resolve({
              success: true,
              images: mockInjectedImages,
            });
          }
          return Promise.resolve({success: false, error: "Invalid folder type"});
        }),
        get_inject_images: jest.fn().mockResolvedValue({success: true, injected_images: []}),
        get_dump_images: jest.fn().mockResolvedValue({success: true, dumped_images: []}),
        validate_sk_folder: jest.fn().mockResolvedValue({isValid: true}),
        validate_texconv_executable: jest.fn().mockResolvedValue({isValid: true}),
        open_file_dialog: jest.fn().mockResolvedValue({
          success: true,
          files: ["/mock/selected/file.jpg"],
        }),
        save_settings: jest.fn().mockResolvedValue({success: true}),
        download_texconv: jest.fn().mockResolvedValue({success: true}),
        download_special_k: jest.fn().mockResolvedValue({success: true}),
        convert_single_dds_to_jpg: jest.fn().mockResolvedValue({success: true}),
        replace_dds: jest.fn().mockResolvedValue({
          success: true,
          message: "Replacement complete!",
        }),
        batch_convert_dump_to_jpg: jest.fn().mockResolvedValue({success: true}),
        batch_download_selected_dds_as_jpg: jest.fn().mockResolvedValue({success: true}),
        frontend_ready: jest.fn().mockResolvedValue(undefined),
        load_url: jest.fn().mockResolvedValue(undefined),
        open_dump_folder: jest.fn().mockResolvedValue({success: true}),
        open_inject_folder: jest.fn().mockResolvedValue({success: true}),
        delete_dds_file: jest.fn().mockResolvedValue({success: true}),
        batch_delete_selected_dds_files: jest.fn().mockResolvedValue({success: true}),
        get_default_sk_path: jest.fn().mockResolvedValue("/mock/default/sk/path"),
        open_cache_folder: jest.fn().mockResolvedValue({success: true}),
        notify_settings_changed: jest.fn().mockResolvedValue({success: true}),
        get_app_version: jest.fn().mockResolvedValue({success: true, version: "1.0.0"}),
        check_for_updates: jest.fn().mockResolvedValue({success: true, latest_version: "1.0.0"}),
        convert_dds_for_display: jest.fn().mockImplementation(async (imagePath: string) => {
          // Simulate conversion by returning a dummy base64 string
          return Promise.resolve({
            success: true,
            src: `data:image/png;base64,MOCK_DATA_FOR_${imagePath.replace(/[^a-zA-Z0-9]/g, "_")}`,
          });
        }),
      } as Window["pywebview"]["api"], // Explicitly cast to the correct type
    };
    mockedApi = window.pywebview.api; // Assign after mocking window.pywebview

    jest.clearAllMocks(); // Clear mocks after initial setup

    // Mock react-responsive
    (useMediaQuery as jest.Mock).mockImplementation((settings) => {
      if (settings.minWidth === 1024) {
        return true;
      }
      if (settings.minWidth === 768) {
        return true;
      }
      return false;
    });

    // Mock window.addEventListener for pywebviewready
    window.addEventListener = jest.fn((event, callback) => {
      if (event === "pywebviewready") {
        (callback as () => void)(); // Immediately call the callback to simulate pywebview being ready
      }
    });
    window.removeEventListener = jest.fn();
  });

  it("renders MainScreen component and loads data successfully", async () => {
    await act(async () => {
      render(<MainScreen />);
    });

    await waitFor(() => {
      expect(screen.getByText("Dumped Images")).toBeInTheDocument();
      expect(
        within(screen.getByRole("tab", {name: /dumped images/i})).getByText("2"),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Injected Images")).toBeInTheDocument();
      expect(
        within(screen.getByRole("tab", {name: /injected images/i})).getByText("1"),
      ).toBeInTheDocument();
    });
  });

  describe("handleReplace", () => {
    it("should successfully replace a DDS image", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      // Wait for images to load and be displayed
      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      // Find the checkbox for the image card
      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });

      // Get the parent label element
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement; // The label is the parent of the checkbox

      const replaceButton = within(imageCardLabel).getByRole("button", {name: "Replace DDS"});
      fireEvent.click(replaceButton);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalledWith("file_open", {
          file_types: [["Image files", "*.jpg"]],
        });
        expect(mockedApi.replace_dds).toHaveBeenCalledWith(
          "/dump/dumped_image_1.dds",
          "/mock/selected/file.jpg",
          true,
        );
        expect(toast.success).toHaveBeenCalledWith(mockLangData.replace_conversion_complete);
      });
    });

    it("should handle failed DDS replacement", async () => {
      mockedApi.replace_dds.mockResolvedValueOnce({
        success: false,
        error: "Failed to replace DDS",
      });

      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      // Find the checkbox for the image card
      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });

      // Get the parent label element
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement; // The label is the parent of the checkbox

      const replaceButton = within(imageCardLabel).getByRole("button", {name: "Replace DDS"});
      fireEvent.click(replaceButton);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalled();
        expect(mockedApi.replace_dds).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith("Failed to replace DDS");
      });
    });

    it("should handle user cancelling file selection", async () => {
      mockedApi.open_file_dialog.mockResolvedValueOnce({
        success: false,
        files: [],
      });

      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      // Find the checkbox for the image card
      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });

      // Get the parent label element
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement; // The label is the parent of the checkbox

      const replaceButton = within(imageCardLabel).getByRole("button", {name: "Replace DDS"});
      fireEvent.click(replaceButton);

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalled();
        expect(mockedApi.replace_dds).not.toHaveBeenCalled(); // Should not call replace_dds
        expect(toast.warning).toHaveBeenCalledWith("Replacement image selection cancelled.");
      });
    });

    it("should not allow replacement if already processing", async () => {
      // Simulate processing state
      let resolveProcessing: (value: {success: boolean; files: string[]}) => void;
      mockedApi.open_file_dialog.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveProcessing = resolve;
          }),
      );

      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      // Find the checkbox for the image card
      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });

      // Get the parent label element
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement; // The label is the parent of the checkbox

      const replaceButton = within(imageCardLabel).getByRole("button", {name: "Replace DDS"});
      fireEvent.click(replaceButton); // Start first replacement

      // Try to click again while processing
      fireEvent.click(replaceButton);

      // Ensure open_file_dialog was only called once
      expect(mockedApi.open_file_dialog).toHaveBeenCalledTimes(1);

      // Resolve the pending promise to clear processing state
      act(() => {
        resolveProcessing({success: true, files: ["/mock/selected/file.jpg"]});
      });

      await waitFor(() => {
        expect(mockedApi.replace_dds).toHaveBeenCalledTimes(1);
      });
    });

    it("should display detailed error message when texconv fails", async () => {
      const mockTexconvError =
        "Texconv failed. Return code: 1. Stdout: Some stdout. Stderr: Some stderr.";
      mockedApi.replace_dds.mockResolvedValueOnce({
        success: false,
        error: mockTexconvError,
      });

      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      // Find the checkbox for the image card
      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });

      // Get the parent label element
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement; // The label is the parent of the checkbox

      const replaceButton = within(imageCardLabel).getByRole("button", {name: "Replace DDS"});
      fireEvent.click(replaceButton);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalled();
        expect(mockedApi.replace_dds).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith(mockTexconvError);
      });
    });
  });

  describe("handleTrash", () => {
    it("should successfully delete a DDS image", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;

      const trashButton = within(imageCardLabel).getByRole("button", {name: "Trash"});

      mockedApi.delete_dds_file.mockResolvedValueOnce({
        success: true,
        message: "Delete successful!",
      });

      fireEvent.click(trashButton);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.delete_dds_file).toHaveBeenCalledWith("/dump/dumped_image_1.dds");
        expect(toast.success).toHaveBeenCalledWith(mockLangData.delete_success);
      });
    });

    it("should handle failed DDS image deletion", async () => {
      mockedApi.delete_dds_file.mockResolvedValueOnce({
        success: false,
        error: "Failed to delete image",
      });

      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;

      const trashButton = within(imageCardLabel).getByRole("button", {name: "Trash"});
      fireEvent.click(trashButton);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.delete_dds_file).toHaveBeenCalledWith("/dump/dumped_image_1.dds");
        expect(toast.error).toHaveBeenCalledWith("Failed to delete image");
      });
    });
  });

  describe("handleDownloadSingle", () => {
    it("should successfully download a single DDS image as JPG", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;

      const downloadButton = within(imageCardLabel).getByRole("button", {name: "Convert to JPG"});

      mockedApi.open_file_dialog.mockResolvedValueOnce({
        success: true,
        files: ["/mock/output/folder"],
      });
      mockedApi.convert_single_dds_to_jpg.mockResolvedValueOnce({
        success: true,
        message: "Conversion complete!",
      });

      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalledWith("folder");
        expect(mockedApi.convert_single_dds_to_jpg).toHaveBeenCalledWith(
          "/dump/dumped_image_1.dds",
          "/mock/output/folder",
        );
        expect(toast.success).toHaveBeenCalledWith("Conversion complete!");
      });
    });

    it("should handle failed single DDS image download", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      const imageCardCheckbox = screen.getByRole("checkbox", {
        name: "dumped_image_1.dds dumped_image_1",
      });
      const imageCardLabel = imageCardCheckbox.parentElement as HTMLElement;

      const downloadButton = within(imageCardLabel).getByRole("button", {name: "Convert to JPG"});

      // Mock the folder selection
      mockedApi.open_file_dialog.mockResolvedValueOnce({
        success: true,
        files: ["/mock/output/folder"],
      });
      mockedApi.convert_single_dds_to_jpg.mockResolvedValueOnce({
        success: false,
        error: "Conversion failed!",
      });

      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalledWith("folder");
        expect(mockedApi.convert_single_dds_to_jpg).toHaveBeenCalledWith(
          "/dump/dumped_image_1.dds",
          "/mock/output/folder",
        );
        expect(toast.error).toHaveBeenCalledWith("Conversion failed!");
      });
    });
  });

  describe("handleBatchTrash", () => {
    it("should successfully delete selected DDS images", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
        expect(screen.getByAltText("dumped_image_2.dds")).toBeInTheDocument();
      });

      await waitFor(() => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_1.dds"));
      });
      await waitFor(() => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_2.dds"));
      });

      mockedApi.batch_delete_selected_dds_files.mockResolvedValueOnce({
        success: true,
        message: "Batch delete successful.",
      });

      const trashButton = screen.getByTestId("batch-trash-button");
      fireEvent.click(trashButton);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.batch_delete_selected_dds_files).toHaveBeenCalledWith([
          "/dump/dumped_image_1.dds",
          "/dump/dumped_image_2.dds",
        ]);
        expect(toast.success).toHaveBeenCalledWith("Batch delete successful.");
      });
    });

    it("should handle failed batch deletion of DDS images", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
        expect(screen.getByAltText("dumped_image_2.dds")).toBeInTheDocument();
      });

      await waitFor(() => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_1.dds"));
      });
      await waitFor(() => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_2.dds"));
      });

      mockedApi.batch_delete_selected_dds_files.mockResolvedValueOnce({
        success: false,
        error: "Failed to delete selected images.",
      });

      const trashButton = screen.getByTestId("batch-trash-button");
      fireEvent.click(trashButton);

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.processing);
      });

      await waitFor(() => {
        expect(mockedApi.batch_delete_selected_dds_files).toHaveBeenCalledWith([
          "/dump/dumped_image_1.dds",
          "/dump/dumped_image_2.dds",
        ]);
        expect(toast.error).toHaveBeenCalledWith("Failed to delete selected images.");
      });
    });
  });

  describe("handleBatchDownload", () => {
    it("should successfully download selected DDS images", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      // Wait for images to load
      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
        expect(screen.getByAltText("dumped_image_2.dds")).toBeInTheDocument();
      });

      // Select images to trigger the appearance of the download button
      await waitFor(() => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_1.dds"));
      });
      await waitFor(() => {
        fireEvent.click(screen.getByDisplayValue("/dump/dumped_image_2.dds"));
      });

      // Mock the folder selection
      mockedApi.open_file_dialog.mockResolvedValueOnce({
        success: true,
        files: ["/mock/output/folder"],
      });

      // Mock the batch download API call
      mockedApi.batch_download_selected_dds_as_jpg.mockResolvedValueOnce({
        success: true,
        message: "Download complete!",
      });

      // Click the download button
      const downloadButton = screen.getByTestId("batch-download-button");
      fireEvent.click(downloadButton);

      // Assertions
      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(mockLangData.downloading_selected_images);
      });

      await waitFor(() => {
        expect(mockedApi.open_file_dialog).toHaveBeenCalledWith("folder");
        expect(mockedApi.batch_download_selected_dds_as_jpg).toHaveBeenCalledWith(
          ["/dump/dumped_image_1.dds", "/dump/dumped_image_2.dds"],
          "/mock/output/folder",
        );
        expect(toast.success).toHaveBeenCalledWith("Download complete!");
      });
    });
  });

  describe("Pagination", () => {
    const mockManyDumpedImages = Array.from({length: 70}).map((_, i) => ({
      src: `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`,
      alt: `dumped_image_${i + 1}.dds`,
      path: `/dump/dumped_image_${i + 1}.dds`,
      width: 100,
      height: 100,
    }));

    beforeEach(() => {
      mockedApi.get_image_list.mockImplementation(async (folderType: string) => {
        if (folderType === "dump") {
          return {
            success: true,
            images: mockManyDumpedImages,
          };
        }
        if (folderType === "inject") {
          return {
            success: true,
            images: [],
          };
        }
        return {success: false, error: "Invalid folder type"};
      });
    });

    it("should display pagination controls when images exceed page limit", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        const dumpedTab = screen.getByRole("tab", {name: /Dumped Images/i});
        expect(within(dumpedTab).getByText("70")).toBeInTheDocument();
      });

      // Check if pagination controls are visible
      expect(screen.getByRole("navigation", {name: "Pagination navigation"})).toBeInTheDocument();
      expect(screen.getByLabelText("next page button")).toBeInTheDocument();
    });

    it("should navigate to the next page when next button is clicked", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        const dumpedTab = screen.getByRole("tab", {name: /Dumped Images/i});
        expect(within(dumpedTab).getByText("70")).toBeInTheDocument();
      });

      // Verify first image of first page is visible
      expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      expect(screen.queryByAltText("dumped_image_65.dds")).not.toBeInTheDocument(); // Image from next page

      const nextPageButton = screen.getByLabelText("next page button");
      fireEvent.click(nextPageButton);

      // Verify first image of second page is visible
      await waitFor(() => {
        expect(screen.queryByAltText("dumped_image_1.dds")).not.toBeInTheDocument();
        expect(screen.getByAltText("dumped_image_65.dds")).toBeInTheDocument();
      });
    });

    it("should navigate to a specific page when page number is clicked", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        const dumpedTab = screen.getByRole("tab", {name: /Dumped Images/i});
        expect(within(dumpedTab).getByText("70")).toBeInTheDocument();
      });

      // Verify first image of first page is visible
      expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();

      // Click on page 2
      const page2Button = screen.getByLabelText("pagination item 2");
      fireEvent.click(page2Button);

      // Verify first image of second page is visible
      await waitFor(() => {
        expect(screen.queryByAltText("dumped_image_1.dds")).not.toBeInTheDocument();
        expect(screen.getByAltText("dumped_image_65.dds")).toBeInTheDocument();
      });
    });
  });

  describe("Select All button", () => {
    it("should toggle between select all and deselect all states", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      });

      const dumpedImagesSection = screen.getByTestId("image-section-dump");

      const selectAllButton = within(dumpedImagesSection as HTMLElement).getByLabelText(
        "Select All",
      );

      // Initial state: Square icon (none selected)
      expect(
        within(dumpedImagesSection as HTMLElement).getByTestId("icon-square"),
      ).toBeInTheDocument();

      // Click to select all
      fireEvent.click(selectAllButton);

      // State after selecting all: SquareCheckBig icon
      await waitFor(() => {
        expect(
          within(dumpedImagesSection as HTMLElement).getByTestId("icon-square-check"),
        ).toBeInTheDocument();
      });

      // Click to deselect all
      fireEvent.click(selectAllButton);

      // State after deselecting all: Square icon
      await waitFor(() => {
        expect(
          within(dumpedImagesSection as HTMLElement).getByTestId("icon-square"),
        ).toBeInTheDocument();
      });

      // Partially select
      fireEvent.click(
        within(dumpedImagesSection as HTMLElement).getByDisplayValue("/dump/dumped_image_1.dds"),
      );

      // State after partial selection: SquareMinus icon
      await waitFor(() => {
        expect(
          within(dumpedImagesSection as HTMLElement).getByTestId("icon-square-minus"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("View Switching", () => {
    it("should switch to Injected Images view when clicked", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        const dumpedTab = screen.getByRole("tab", {name: /Dumped Images/i});
        expect(within(dumpedTab).getByText("2")).toBeInTheDocument();
      });

      const injectedViewButton = screen.getByText(/Injected Images/i);
      fireEvent.click(injectedViewButton);

      await waitFor(() => {
        const injectedTab = screen.getByRole("tab", {name: /Injected Images/i});
        expect(within(injectedTab).getByText("1")).toBeInTheDocument();
        const dumpedSection = screen.getByTestId("image-section-dump");
        expect(dumpedSection.parentElement).toHaveClass("hidden");
      });

      // Verify injected image is visible
      expect(screen.getByAltText("injected_image_1.dds")).toBeInTheDocument();
      const dumpedSection = screen.getByTestId("image-section-dump");
      expect(dumpedSection.parentElement).toHaveClass("hidden");
    });

    it("should switch back to Dumped Images view when clicked", async () => {
      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        const dumpedTab = screen.getByRole("tab", {name: /Dumped Images/i});
        expect(within(dumpedTab).getByText("2")).toBeInTheDocument();
      });

      const injectedViewButton = screen.getByText(/Injected Images/i);
      fireEvent.click(injectedViewButton);

      await waitFor(() => {
        const injectedTab = screen.getByRole("tab", {name: /Injected Images/i});
        expect(within(injectedTab).getByText("1")).toBeInTheDocument();
      });

      const dumpedViewButton = screen.getByText(/Dumped Images/i);
      fireEvent.click(dumpedViewButton);

      await waitFor(() => {
        const dumpedTab = screen.getByRole("tab", {name: /Dumped Images/i});
        expect(within(dumpedTab).getByText("2")).toBeInTheDocument();
        const injectedSection = screen.getByTestId("image-section-inject");
        expect(injectedSection.parentElement).toHaveClass("hidden");
      });

      // Verify dumped image is visible
      expect(screen.getByAltText("dumped_image_1.dds")).toBeInTheDocument();
      const injectedSection = screen.getByTestId("image-section-inject");
      expect(injectedSection.parentElement).toHaveClass("hidden");
    });
  });

  describe("Initial Load Failure", () => {
    // Mock console.error to prevent test output pollution
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("should handle get_settings failure on initial load", async () => {
      mockedApi.get_settings.mockRejectedValueOnce(new Error("Failed to load settings"));

      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          "Failed to load initial data:",
          expect.any(Error),
        );
      });
      // Assert that images are not loaded or appropriate error state is shown
      const dumpedTab = screen.getByRole("tab", {name: /Dumped Images/i});
      expect(within(dumpedTab).getByText("0")).toBeInTheDocument();

      const injectedTab = screen.getByRole("tab", {name: /Injected Images/i});
      expect(within(injectedTab).getByText("0")).toBeInTheDocument();
    });

    it("should handle get_image_list failure for dump images on initial load", async () => {
      mockedApi.get_image_list.mockImplementation(async (folderType: string) => {
        if (folderType === "dump") {
          return {success: false, error: "Failed to load dump images"};
        }
        return {success: true, images: mockInjectedImages};
      });

      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          "Failed to load dump images:",
          "Failed to load dump images",
        );
      });
      // Assert that dump images section is empty
      const dumpedTab = screen.getByRole("tab", {name: /Dumped Images/i});
      expect(within(dumpedTab).getByText("0")).toBeInTheDocument();
      expect(screen.queryByAltText("dumped_image_1.dds")).not.toBeInTheDocument();
    });

    it("should handle get_image_list failure for inject images on initial load", async () => {
      mockedApi.get_image_list.mockImplementation(async (folderType: string) => {
        if (folderType === "inject") {
          return {success: false, error: "Failed to load inject images"};
        }
        return {success: true, images: mockDumpedImages};
      });

      await act(async () => {
        render(<MainScreen />);
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          "Failed to load inject images:",
          "Failed to load inject images",
        );
      });
      // Assert that inject images section is empty
      const injectedTab = screen.getByRole("tab", {name: /Injected Images/i});
      expect(within(injectedTab).getByText("0")).toBeInTheDocument();
      expect(screen.queryByAltText("injected_image_1.dds")).not.toBeInTheDocument();
    });
  });
});
