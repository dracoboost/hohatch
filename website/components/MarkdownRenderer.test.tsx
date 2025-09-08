import {fireEvent, render, screen} from "@testing-library/react";

import {Lightbox} from "./Lightbox";
import {MarkdownRenderer} from "./MarkdownRenderer";

describe("MarkdownRenderer", () => {
  it("renders markdown content correctly", () => {
    const markdown = "# Hello World\n\nThis is a paragraph.\n\n- List item 1\n- List item 2";
    render(
      <Lightbox>
        <MarkdownRenderer markdownContent={markdown} />
      </Lightbox>,
    );

    expect(screen.getByRole("heading", {name: "Hello World"})).toBeInTheDocument();
    expect(screen.getByText("This is a paragraph.")).toBeInTheDocument();
    expect(screen.getByText("List item 1")).toBeInTheDocument();
  });

  it("renders links correctly", () => {
    const markdown = "[Google](https://google.com)";
    render(
      <Lightbox>
        <MarkdownRenderer markdownContent={markdown} />
      </Lightbox>,
    );

    const link = screen.getByRole("link", {name: "Google"});
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://google.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders images and opens lightbox on click", () => {
    const markdown = "![Alt Text](/images/test.png)";
    render(
      <Lightbox>
        <MarkdownRenderer markdownContent={markdown} />
      </Lightbox>,
    );

    const image = screen.getByAltText("Alt Text");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining("/images/test.png"));

    fireEvent.click(image);
    expect(screen.getByAltText("Lightbox view")).toBeInTheDocument();
    expect(screen.getByAltText("Lightbox view")).toHaveAttribute(
      "src",
      expect.stringContaining("/images/test.png"),
    );
  });
});
