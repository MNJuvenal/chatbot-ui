import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatbotUI from "./components/ChatbotUI";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ response: "Réponse simulée du bot." }),
    })
  );
});

afterEach(() => {
  global.fetch.mockClear();
});

test("envoie un message et affiche la réponse du bot", async () => {
  render(<ChatbotUI />);
  fireEvent.change(screen.getByPlaceholderText("Écris un message..."), {
    target: { value: "Salut" },
  });
  fireEvent.click(screen.getByText("Envoyer"));

  await waitFor(() => {
    expect(screen.getByText("Réponse simulée du bot.")).toBeInTheDocument();
  });

  expect(screen.getByText("Salut")).toBeInTheDocument();
});

test("n'envoie pas de message vide", () => {
  render(<ChatbotUI />);
  fireEvent.change(screen.getByPlaceholderText("Écris un message..."), {
    target: { value: "     " },
  });
  fireEvent.click(screen.getByText("Envoyer"));

  expect(global.fetch).not.toHaveBeenCalled();
});



test("affiche un message d'erreur si l'API échoue", async () => {
  global.fetch = jest.fn(() => Promise.reject("Erreur API"));

  render(<ChatbotUI />);
  fireEvent.change(screen.getByPlaceholderText("Écris un message..."), {
    target: { value: "Coucou" },
  });
  fireEvent.click(screen.getByText("Envoyer"));

  await waitFor(() => {
    expect(
      screen.getByText("Erreur de connexion à l'API.")
    ).toBeInTheDocument();
  });
});

test("le champ est vidé après l'envoi", async () => {
  render(<ChatbotUI />);
  const input = screen.getByPlaceholderText("Écris un message...");
  fireEvent.change(input, { target: { value: "Salut" } });
  fireEvent.click(screen.getByText("Envoyer"));

  await waitFor(() => {
    expect(input.value).toBe("");
  });
});
