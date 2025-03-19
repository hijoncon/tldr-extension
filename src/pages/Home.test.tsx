import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./Home";
import { fetchBroadcasterInfo, fetchMetadata } from "../apis/StreamInfo";

// Mock the API calls
jest.mock("../apis/StreamInfo", () => ({
  fetchBroadcasterInfo: jest.fn(),
  fetchMetadata: jest.fn(),
}));

// Type assertion for mocked functions
const mockedFetchBroadcasterInfo = fetchBroadcasterInfo as jest.MockedFunction<
  typeof fetchBroadcasterInfo
>;
const mockedFetchMetadata = fetchMetadata as jest.MockedFunction<
  typeof fetchMetadata
>;

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window as any).Twitch = {
      ext: {
        onAuthorized: jest.fn((callback) => {
          callback({
            channelId: "12345",
            channelName: "TestChannel",
            clientId: "test-client-id",
            token: "test-token",
            userId: "test-user-id",
            helixToken: "test-helix-token",
          });
        }),
      },
    };
  });

  test("renders initial state correctly", async () => {
    await act(async () => {
      render(<Home />);
    });
    expect(screen.getByText("Highlights for Channel Name")).toBeInTheDocument();
    expect(screen.getByText("Are you a streamer?")).toBeInTheDocument();
    expect(screen.getByText("Get TLDR")).toBeInTheDocument();
    expect(screen.getByText("Visit TL-DR.tv")).toBeInTheDocument();
  });

  test("updates channel name and thumbnail when authorized", async () => {
    mockedFetchBroadcasterInfo.mockResolvedValue({
      id: "12345",
      login: "testchannel",
      display_name: "TestChannel",
      type: "",
      broadcaster_type: "partner",
      description: "Test channel description",
      profile_image_url: "http://example.com/image.jpg",
      offline_image_url: "http://example.com/offline.jpg",
      view_count: 1000,
      email: "test@example.com",
      created_at: "2020-01-01T00:00:00Z",
    });

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Highlights for TestChannel/i)
      ).toBeInTheDocument();
    });

    const thumbnailImg = screen.getAllByRole("img")[1];
    expect(thumbnailImg).toHaveAttribute("src", "http://example.com/image.jpg");
  });

  test("handles API error gracefully", async () => {
    mockedFetchBroadcasterInfo.mockRejectedValue(new Error("API Error"));
    mockedFetchMetadata.mockRejectedValue(new Error("API Error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to set user info")
      );
    });

    expect(screen.getByText("Highlights for Channel Name")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test("footer links have correct attributes", async () => {
    await act(async () => {
      render(<Home />);
    });
    const getTLDRLink = screen.getByText("Get TLDR");
    expect(getTLDRLink).toHaveClass(
      "font-semibold",
      "text-blue-600",
      "hover:underline"
    );

    const visitTLDRLink = screen.getByText("Visit TL-DR.tv");
    expect(visitTLDRLink).toHaveAttribute("href", "https://tl-dr.tv");
    expect(visitTLDRLink).toHaveClass("hover:underline", "cursor-pointer");
  });
});
