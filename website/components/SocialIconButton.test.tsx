import {render, screen} from "@testing-library/react";

import {SocialIconButton} from "./SocialIconButton";

describe("SocialIconButton", () => {
  it("renders Discord icon with correct link and tooltip", () => {
    render(<SocialIconButton type="discord" />);
    const button = screen.getByRole("button", {name: "Discord"});
    expect(button).toBeInTheDocument();
    expect(button.closest("a")).toHaveAttribute("href", "https://discord.gg/fEUMrTGb23");
    expect(screen.getByText("Join the Mod Community")).toBeInTheDocument();
  });

  it("renders X icon with correct link and tooltip", () => {
    render(<SocialIconButton type="x" />);
    const button = screen.getByRole("button", {name: "X"});
    expect(button).toBeInTheDocument();
    expect(button.closest("a")).toHaveAttribute("href", expect.stringContaining("twitter.com"));
    expect(screen.getByText("Share HoHatch")).toBeInTheDocument();
  });

  it("renders GitHub icon with correct link and tooltip", () => {
    render(<SocialIconButton type="github" />);
    const button = screen.getByRole("button", {name: "GitHub"});
    expect(button).toBeInTheDocument();
    expect(button.closest("a")).toHaveAttribute("href", "https://github.com/dracoboost/hohatch");
    expect(screen.getByText("View Source Code")).toBeInTheDocument();
  });

  it("renders Reddit icon with correct link and tooltip", () => {
    render(<SocialIconButton type="reddit" />);
    const button = screen.getByRole("button", {name: "Reddit"});
    expect(button).toBeInTheDocument();
    expect(button.closest("a")).toHaveAttribute(
      "href",
      "https://www.reddit.com/r/ShadowverseMods/",
    );
    expect(screen.getByText("Join the Mod Community on Reddit")).toBeInTheDocument();
  });
});
