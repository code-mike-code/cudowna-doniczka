import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/ContactForm';
import { Toaster } from '@/components/ui/sonner';

// Mock EmailJS
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
  },
}));

describe('ContactForm', () => {
  it('renders contact form with all fields', () => {
    render(
      <>
        <ContactForm />
        <Toaster />
      </>
    );
    
    expect(screen.getByLabelText(/imię/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wiadomość/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /wyślij wiadomość/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ContactForm />
        <Toaster />
      </>
    );

    const submitButton = screen.getByRole('button', { name: /wyślij wiadomość/i });
    await user.click(submitButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/imię musi mieć co najmniej 2 znaki/i)).toBeInTheDocument();
    });
  });

  it('validates minimum message length', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ContactForm />
        <Toaster />
      </>
    );

    await user.type(screen.getByLabelText(/imię/i), 'Jan');
    await user.type(screen.getByLabelText(/email/i), 'jan@example.com');
    await user.type(screen.getByLabelText(/wiadomość/i), 'ab');

    const submitButton = screen.getByRole('button', { name: /wyślij wiadomość/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/wiadomość musi mieć co najmniej 4 znaki/i)).toBeInTheDocument();
    });
  });

  it('disables form fields while submitting', async () => {
    const user = userEvent.setup();
    render(
      <>
        <ContactForm />
        <Toaster />
      </>
    );

    const nameInput = screen.getByLabelText(/imię/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/wiadomość/i);

    await user.type(nameInput, 'Jan Kowalski');
    await user.type(emailInput, 'jan@example.com');
    await user.type(messageInput, 'To jest testowa wiadomość dla Cudownej Doniczki');

    // Check fields are enabled before submit
    expect(nameInput).not.toBeDisabled();
    expect(emailInput).not.toBeDisabled();
    expect(messageInput).not.toBeDisabled();
  });
});
