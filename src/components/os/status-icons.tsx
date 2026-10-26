export const IosSignal = () => (
  <svg viewBox="0 0 18 12" width="18" height="12" fill="currentColor" aria-hidden="true">
    <rect x="0" y="8" width="3" height="4" rx="0.8" />
    <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
    <rect x="10" y="3" width="3" height="9" rx="0.8" />
    <rect x="15" y="0" width="3" height="12" rx="0.8" />
  </svg>
);

export const IosNetwork = () => <span className="ios-net">5G</span>;

export const IosBattery = ({ level = 82 }: { level?: number }) => (
  <span className="ios-battery" aria-label={`Battery ${level}%`}>
    <span className="ios-battery-body">
      <span className="ios-battery-fill" style={{ width: `${level}%` }} />
      <span className="ios-battery-text">{level}</span>
    </span>
    <span className="ios-battery-cap" />
  </span>
);

export const MacWifi = () => (
  <svg viewBox="0 0 16 12" width="16" height="12" fill="currentColor" aria-hidden="true">
    <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.3C13.3 1.6 10.8.5 8 .5S2.7 1.6.8 3.5L2 4.8c1.6-1.5 3.7-2.4 6-2.4z" />
    <path d="M8 5.9c1.4 0 2.6.5 3.6 1.4l1.2-1.3C11.5 4.8 9.8 4.1 8 4.1s-3.5.7-4.8 1.9l1.2 1.3c1-.9 2.2-1.4 3.6-1.4z" />
    <path d="M8 9.3c.5 0 1 .2 1.3.5L8 11.5 6.7 9.8c.3-.3.8-.5 1.3-.5z" />
  </svg>
);
