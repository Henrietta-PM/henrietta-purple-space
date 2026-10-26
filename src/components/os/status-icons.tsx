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
