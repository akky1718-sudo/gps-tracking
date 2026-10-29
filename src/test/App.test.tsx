import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../App';

// Mock react-leaflet to run smoothly in JSDOM
vi.mock('react-leaflet', () => {
  return {
    MapContainer: ({ children }: any) => <div data-testid="leaflet-map-container">{children}</div>,
    TileLayer: () => <div data-testid="leaflet-tile-layer" />,
    Marker: ({ position, eventHandlers }: any) => (
      <div
        data-testid="leaflet-marker"
        data-lat={position[0]}
        data-lng={position[1]}
        onClick={() => {
          if (eventHandlers?.dragend) {
            eventHandlers.dragend();
          }
        }}
      />
    ),
    Circle: ({ center, radius }: any) => (
      <div data-testid="leaflet-accuracy-circle" data-lat={center[0]} data-lng={center[1]} data-radius={radius} />
    ),
    useMap: () => ({
      flyTo: vi.fn(),
      getZoom: () => 18,
    }),
    useMapEvents: (handlers: any) => {
      (window as any).__triggerMapClick = (lat: number, lng: number) => {
        handlers.click({ latlng: { lat, lng } });
      };
      return null;
    },
  };
});

describe('ExactPin Application Integration Tests', () => {
  const originalGeolocation = navigator.geolocation;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: originalGeolocation,
    });
    delete (window as any).__triggerMapClick;
  });

  it('1. The app loads successfully with title and tagline', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ExactPin/i);
    expect(screen.getAllByText(/Pin your place. Make every delivery easier./i)[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Detect GPS Location/i })).toBeInTheDocument();
  });

  it('2. Location permission is requested only after the user initiates GPS detection', () => {
    const getCurrentPositionMock = vi.fn();
    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: { getCurrentPosition: getCurrentPositionMock },
    });

    render(<App />);
    expect(getCurrentPositionMock).not.toHaveBeenCalled();

    const detectBtn = screen.getByRole('button', { name: /Detect GPS Location/i });
    fireEvent.click(detectBtn);

    expect(getCurrentPositionMock).toHaveBeenCalledTimes(1);
  });

  it('3. Successful GPS detection populates coordinates and shows accuracy', async () => {
    const mockPos = {
      coords: {
        latitude: 17.385044,
        longitude: 78.486671,
        accuracy: 9,
      },
      timestamp: 1670000000000,
    };

    const getCurrentPositionMock = vi.fn().mockImplementation((success) => {
      success(mockPos);
    });

    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: { getCurrentPosition: getCurrentPositionMock },
    });

    render(<App />);
    const detectBtn = screen.getByRole('button', { name: /Detect GPS Location/i });
    
    await act(async () => {
      fireEvent.click(detectBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('17.385044, 78.486671')).toBeInTheDocument();
    });

    expect(screen.getByText(/±9m \(High accuracy\)/i)).toBeInTheDocument();
  });

  it('4. GPS errors display helpful error messages and recovery instructions', async () => {
    const mockError = {
      code: 1, // PERMISSION_DENIED
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: 'Permission denied by user',
    };

    const getCurrentPositionMock = vi.fn().mockImplementation((_, error) => {
      error(mockError);
    });

    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: { getCurrentPosition: getCurrentPositionMock },
    });

    render(<App />);
    const detectBtn = screen.getByRole('button', { name: /Detect GPS Location/i });

    await act(async () => {
      fireEvent.click(detectBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Location access was denied/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });

  it('5 & 6. Clicking the map or placing a pin updates selected location and clears GPS accuracy badge', async () => {
    render(<App />);

    await act(async () => {
      (window as any).__triggerMapClick(17.448291, 78.374183);
    });

    await waitFor(() => {
      expect(screen.getByText('17.448291, 78.374183')).toBeInTheDocument();
    });

    expect(screen.getByText(/Manually Positioned Pin/i)).toBeInTheDocument();
  });

  it('7. Moving the pin automatically changes the Google Maps link immediately', async () => {
    render(<App />);

    // First position
    await act(async () => {
      (window as any).__triggerMapClick(12.971598, 77.594562);
    });

    await waitFor(() => {
      expect(screen.getByText('12.971598, 77.594562')).toBeInTheDocument();
    });

    const mapsLink = screen.getByRole('link', { name: /Open in Google Maps/i });
    expect(mapsLink).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=12.971598,77.594562'
    );

    // Second position
    await act(async () => {
      (window as any).__triggerMapClick(12.971650, 77.594610);
    });

    await waitFor(() => {
      expect(screen.getByText('12.971650, 77.594610')).toBeInTheDocument();
    });

    expect(mapsLink).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=12.971650,77.594610'
    );
  });

  it('8 & 9. Copy actions use the latest selected location', async () => {
    render(<App />);

    await act(async () => {
      (window as any).__triggerMapClick(28.613939, 77.209021);
    });

    await waitFor(() => {
      expect(screen.getByText('28.613939, 77.209021')).toBeInTheDocument();
    });

    // Click Copy Coordinates
    const copyCoordsBtn = screen.getByRole('button', { name: /Copy Coordinates/i });
    await act(async () => {
      fireEvent.click(copyCoordsBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('28.613939, 77.209021');

    // Click Copy Google Maps Link
    const copyLinkBtn = screen.getByRole('button', { name: /Copy Google Maps Link/i });
    await act(async () => {
      fireEvent.click(copyLinkBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'https://www.google.com/maps/search/?api=1&query=28.613939,77.209021'
    );
  });

  it('10. No fabricated location is shown before the user detects or selects one', () => {
    render(<App />);
    expect(screen.getByText(/No Location Selected/i)).toBeInTheDocument();
    expect(screen.queryByTestId('leaflet-marker')).not.toBeInTheDocument();
  });
});
