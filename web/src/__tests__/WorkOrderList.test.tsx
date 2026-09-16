import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { WorkOrderList } from '../components/WorkOrderList';
import { apiFetch } from '../api/client';
import { AuthContext } from '../auth/AuthContext';

// Mock the API client utility
vi.mock('../api/client', () => ({
  apiFetch: vi.fn(),
}));

const mockWorkOrders = [
  {
    id: '1',
    title: 'Fix HVAC Unit',
    description: 'A/C is not cooling properly',
    status: 'open',
    priority: 'high',
    assignee: 'tech1',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Replace Light Bulbs',
    description: 'Hallway lighting out',
    status: 'in_progress',
    priority: 'low',
    assignee: null,
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-02T11:00:00Z',
  },
];

describe('WorkOrderList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and renders work orders in a table', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce(mockWorkOrders);

    render(
      <AuthContext.Provider
        value={{
          user: { username: 'admin', role: 'admin' },
          token: 'mock-token',
          login: vi.fn(),
          logout: vi.fn(),
          isLoading: false,
        }}
      >
        <WorkOrderList />
      </AuthContext.Provider>
    );

    // Verify loading header
    expect(screen.getByText('Work Orders')).toBeInTheDocument();

    // Wait for work orders to render
    await waitFor(() => {
      expect(screen.getByText('Fix HVAC Unit')).toBeInTheDocument();
      expect(screen.getByText('Replace Light Bulbs')).toBeInTheDocument();
    });

    // Check status options and assignee text
    expect(screen.getByText('A/C is not cooling properly')).toBeInTheDocument();
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });

  it('renders "No work orders found" when API returns an empty array', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(
      <AuthContext.Provider
        value={{
          user: { username: 'tech1', role: 'tech' },
          token: 'mock-token',
          login: vi.fn(),
          logout: vi.fn(),
          isLoading: false,
        }}
      >
        <WorkOrderList />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('No work orders found.')).toBeInTheDocument();
    });
  });
});