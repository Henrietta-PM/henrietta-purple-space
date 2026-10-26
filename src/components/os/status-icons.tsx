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

export const MacWifiArcs = () => (
  <svg viewBox="0 0 18 13" width="18" height="13" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
    <path d="M1.93 4.93a10 10 0 0 1 14.14 0" />
    <path d="M4.76 7.76a6 6 0 0 1 8.48 0" />
    <circle cx="9" cy="11" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const MacBattery = ({ level = 82 }: { level?: number }) => (
  <span className="mac-battery" aria-label={`Battery ${level}%`}>
    <span className="mac-battery-pct">{level}%</span>
    <svg viewBox="0 0 26 12" width="26" height="12" aria-hidden="true">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="2" y="2" width={(19 * level) / 100} height="8" rx="1.6" fill="currentColor" />
      <path d="M24 4v4c.7-.2 1.2-1 1.2-2s-.5-1.8-1.2-2z" fill="currentColor" fillOpacity="0.45" />
    </svg>
  </span>
);

export const AppleLogo = () => (
  <svg viewBox="0 0 24 24" width="14" height="16" fill="currentColor" aria-hidden="true">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.701" />
  </svg>
);
