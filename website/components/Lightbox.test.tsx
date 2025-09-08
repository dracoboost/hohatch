import {fireEvent, render, screen} from "@testing-library/react";

import {Lightbox, useLightbox} from "./Lightbox";

const TestComponent = () => {
  const {openLightbox} = useLightbox();
  return <button onClick={() => openLightbox("/test-image.jpg")}>Open Lightbox</button>;
};

describe("Lightbox", () => {
  it("renders children", () => {
    render(
      <Lightbox>
        <div>Test Child</div>
      </Lightbox>,
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("opens when openLightbox is called", () => {
    render(
      <Lightbox>
        <TestComponent />
      </Lightbox>,
    );
    fireEvent.click(screen.getByText("Open Lightbox"));
    expect(screen.getByAltText("Lightbox view")).toBeInTheDocument();
    expect(screen.getByAltText("Lightbox view")).toHaveAttribute(
      "src",
      expect.stringContaining("/test-image.jpg"),
    );
  });

  it("closes when close button is clicked", () => {
    render(
      <Lightbox>
        <TestComponent />
      </Lightbox>,
    );
    fireEvent.click(screen.getByText("Open Lightbox"));
    expect(screen.getByAltText("Lightbox view")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close Lightbox"));
    expect(screen.queryByAltText("Lightbox view")).not.toBeInTheDocument();
  });

  it("closes when background is clicked", () => {
    render(
      <Lightbox>
        <TestComponent />
      </Lightbox>,
    );
    fireEvent.click(screen.getByText("Open Lightbox"));
    expect(screen.getByAltText("Lightbox view")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("lightbox-overlay")); // Assuming data-testid="lightbox-overlay" on the background div
    expect(screen.queryByAltText("Lightbox view")).not.toBeInTheDocument();
  });

  it("toggles zoom on image click", () => {
    render(
      <Lightbox>
        <TestComponent />
      </Lightbox>,
    );
    fireEvent.click(screen.getByText("Open Lightbox"));
    const image = screen.getByAltText("Lightbox view");

    expect(image).not.toHaveClass("max-w-none"); // Not zoomed initially

    fireEvent.click(image);
    expect(image).toHaveClass("max-w-none"); // Zoomed

    fireEvent.click(image);
    expect(image).not.toHaveClass("max-w-none"); // Unzoomed
  });

  it("closes on Escape key press", () => {
    render(
      <Lightbox>
        <TestComponent />
      </Lightbox>,
    );
    fireEvent.click(screen.getByText("Open Lightbox"));
    expect(screen.getByAltText("Lightbox view")).toBeInTheDocument();

    fireEvent.keyDown(document, {key: "Escape"});
    expect(screen.queryByAltText("Lightbox view")).not.toBeInTheDocument();
  });
});
