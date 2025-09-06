import { render, screen } from "@testing-library/react";
import { WebsiteHeader } from "./WebsiteHeader";

describe("WebsiteHeader", () => {
  it("renders the header with version", () => {
    render(<WebsiteHeader version="1.2.3" />);
    expect(screen.getByText("HoHatch")).toBeInTheDocument();
    expect(screen.getByAltText("version")).toHaveAttribute("src", expect.stringContaining("1.2.3"));
  });

  it("renders website link", () => {
    render(<WebsiteHeader version="1.2.3" />);
    const websiteLink = screen.getByRole("link", { name: /HoHatch App Image/i });
    expect(websiteLink).toHaveAttribute("href", "https://hohatch.draco.moe");
  });

  it("renders latest release link", () => {
    render(<WebsiteHeader version="1.2.3" />);
    const releaseLink = screen.getByRole("link", { name: /version/i });
    expect(releaseLink).toHaveAttribute("href", "https://github.com/dracoboost/hohatch/releases");
  });
});