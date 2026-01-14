interface ZoomControlProps {
  zoomLevel: number;
  setZoomLevel: (value: number) => void;
}

export const ZoomControl = ({ zoomLevel, setZoomLevel }: ZoomControlProps) => {
  const min = 0.5;
  const max = 1.5;
  const step = 0.1;

  const handleDecrease = () => {
    setZoomLevel(Math.max(min, zoomLevel - step));
  };

  const handleIncrease = () => {
    setZoomLevel(Math.min(max, zoomLevel + step));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrease}
        disabled={zoomLevel <= min}
        className="btn btn-sm btn-primary"
        aria-label="Decrease zoom"
      >
        −
      </button>
      <span className="text-sm font-medium min-w-12 text-center">
        {(zoomLevel * 100).toFixed(0)}%
      </span>
      <button
        onClick={handleIncrease}
        disabled={zoomLevel >= max}
        className="btn btn-sm btn-primary"
        aria-label="Increase zoom"
      >
        +
      </button>
    </div>
  );
};
