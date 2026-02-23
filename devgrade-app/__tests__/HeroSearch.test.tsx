import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HeroSearch from '@/components/home/HeroSearch';
import { useRouter } from 'next/navigation';

// Mock Next.js useRouter
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('HeroSearch Component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        // Clear all mocks between tests
        jest.clearAllMocks();

        // Mock the global fetch API
        global.fetch = jest.fn();
    });

    it('renders the search input and analyze button securely', () => {
        render(<HeroSearch />);

        const input = screen.getByPlaceholderText(/Enter your GitHub username/i);
        const button = screen.getByRole('button', { name: /Analyze GitHub portfolio/i });

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it('updates input value on change', () => {
        render(<HeroSearch />);
        const input = screen.getByPlaceholderText(/Enter your GitHub username/i);

        fireEvent.change(input, { target: { value: 'testuser' } });
        expect(input).toHaveValue('testuser');
    });

    it('prevents API calls on empty submissions', async () => {
        render(<HeroSearch />);

        const button = screen.getByRole('button', { name: /Analyze GitHub portfolio/i });
        fireEvent.click(button);

        expect(global.fetch).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });

    it('shows loading state and triggers API request on valid submission', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ overallScore: 100 }),
        });

        render(<HeroSearch />);
        const input = screen.getByPlaceholderText(/Enter your GitHub username/i);
        const button = screen.getByRole('button', { name: /Analyze GitHub portfolio/i });

        // Enter text
        fireEvent.change(input, { target: { value: 'testuser123' } });

        // Submit
        fireEvent.click(button);

        // Verify Loading State
        expect(button).toHaveTextContent(''); // Should be showing the loader spinner icon
        expect(button).toBeDisabled();

        // Wait for push to be called
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard?user=testuser123');
        });

        // Verify Fetch payload
        expect(global.fetch).toHaveBeenCalledWith('/api/analyze', expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('https://github.com/testuser123')
        }));
    });

    it('handles error messages correctly by displaying them', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'User not found processing Profile' }),
        });

        render(<HeroSearch />);
        const input = screen.getByPlaceholderText(/Enter your GitHub username/i);
        const button = screen.getByRole('button', { name: /Analyze GitHub portfolio/i });

        fireEvent.change(input, { target: { value: 'invaliduser_404' } });
        fireEvent.click(button);

        // Wait for the error component to mount
        await waitFor(() => {
            expect(screen.getByText('User not found processing Profile')).toBeInTheDocument();
        });

        // Ensure navigation did not occur
        expect(mockPush).not.toHaveBeenCalled();

        // Button should return to normal state
        expect(button).not.toBeDisabled();
    });
});
