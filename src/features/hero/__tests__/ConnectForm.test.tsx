import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConnectForm from "../ConnectForm";

describe("ConnectForm", () => {
  it("renders email input and submit button", () => {
    render(<ConnectForm />);
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /connect with me/i })).toBeInTheDocument();
  });

  it("updates email value as user types", () => {
    render(<ConnectForm />);
    const input = screen.getByPlaceholderText("Email address");
    fireEvent.change(input, { target: { value: "tim@example.com" } });
    expect(input).toHaveValue("tim@example.com");
  });

  it("calls onSubmit with the entered email on form submit", () => {
    const handleSubmit = vi.fn();
    render(<ConnectForm onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "tim@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /connect with me/i }).closest("form")!);
    expect(handleSubmit).toHaveBeenCalledOnce();
    expect(handleSubmit).toHaveBeenCalledWith("tim@example.com");
  });

  it("does not throw when submitted without an onSubmit handler", () => {
    render(<ConnectForm />);
    expect(() =>
      fireEvent.submit(
        screen.getByRole("button", { name: /connect with me/i }).closest("form")!
      )
    ).not.toThrow();
  });
});
