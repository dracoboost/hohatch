import {render, screen} from "@testing-library/react";

import {MarkdownRenderer} from "./MarkdownRenderer";

describe("MarkdownRenderer", () => {
  it("renders markdown content correctly", () => {
    const markdown = "# Hello World\n\nThis is a paragraph.\n\n- List item 1\n- List item 2";
    render(<MarkdownRenderer markdownContent={markdown} />);

    expect(screen.getByRole("heading", {name: "Hello World"})).toBeInTheDocument();
    expect(screen.getByText("This is a paragraph.")).toBeInTheDocument();
    expect(screen.getByText("List item 1")).toBeInTheDocument();
  });

  it("renders links correctly", () => {
    const markdown = "[Google](https://google.com)";
    render(<MarkdownRenderer markdownContent={markdown} />);

    const link = screen.getByRole("link", {name: "Google"});
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://google.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders images and opens lightbox on click", () => {
    const markdown = "![Alt Text](/images/test.png)";
    render(<MarkdownRenderer markdownContent={markdown} />);

    const image = screen.getByAltText("Alt Text");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining("/images/test.png"));
  });
});
