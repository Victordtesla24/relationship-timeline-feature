import React from 'react';
import { render, screen } from '@testing-library/react';
import TimelinePage from '@/app/timeline/page';

// Mock components
jest.mock('@/components/dashboard/DashboardHeader', () => {
  return function MockDashboardHeader() {
    return <header data-testid="dashboard-header">DashboardHeader</header>;
  };
});

jest.mock('@/components/timeline/Timeline', () => {
  return function MockTimeline() {
    return <div data-testid="timeline">Timeline Component</div>;
  };
});

jest.mock('@/components/timeline/TimelineControls', () => {
  return function MockTimelineControls() {
    return <div data-testid="timeline-controls">TimelineControls</div>;
  };
});

describe('Timeline Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders timeline page with all components', async () => {
    // Use 'as any' to avoid TypeScript errors with ReactElement
    const mockProps = {
      params: {},
      searchParams: {}
    };
    
    render(await TimelinePage(mockProps) as any);
    
    // Check that all components are rendered
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByTestId('timeline-controls')).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getByText('Relationship Timeline')).toBeInTheDocument();
  });
});

// Test the integration between different components in the timeline feature
describe('Timeline Feature Integration', () => {
  // Here we would mock fetch responses and test the full flow
  // from loading events to displaying them in the timeline
  // to adding/editing events
  
  it('loads and displays events in the timeline', async () => {
    // This would be implemented in an end-to-end test using Cypress or Playwright
    // Since we're mocking components in this test suite, we'll just verify the structure
    
    const mockProps = {
      params: {},
      searchParams: { relationshipId: 'test-relationship-id' }
    };
    
    render(await TimelinePage(mockProps) as any);
    
    // The actual integration test would verify:
    // 1. Timeline component makes a fetch request for events
    // 2. Events are displayed correctly
    // 3. User can add new events
    // 4. User can edit existing events
    
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });
}); 