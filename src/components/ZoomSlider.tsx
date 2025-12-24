import { IconMinus, IconPlus } from "@tabler/icons-react";

const DEFAULT_ZOOM_MIN = 0.3;
const DEFAULT_ZOOM_MAX = 2.2;
const DEFAULT_ZOOM_STEP = 0.1;
export const DEFAULT_ZOOM_VALUE = 1;

export const ZoomSlider = ({
  zoom,
  setZoom,
}: {
  zoom: number;
  setZoom: (zoom: number) => void;
}) => {
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + DEFAULT_ZOOM_STEP, DEFAULT_ZOOM_MAX);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - DEFAULT_ZOOM_STEP, DEFAULT_ZOOM_MIN);
    setZoom(newZoom);
  };

  const isAtMin = zoom <= DEFAULT_ZOOM_MIN;
  const isAtMax = zoom >= DEFAULT_ZOOM_MAX;

  return (
    <div className="flex items-center gap-2">
      {/* Mobile: Plus/Minus buttons with label */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={handleZoomOut}
          className="btn btn-sm btn-circle btn-outline"
          disabled={isAtMin}
          aria-label="Zoom out"
        >
          <IconMinus size={16} />
        </button>
        <span className="text-sm font-medium">zoom</span>
        <button
          onClick={handleZoomIn}
          className="btn btn-sm btn-circle btn-outline"
          disabled={isAtMax}
          aria-label="Zoom in"
        >
          <IconPlus size={16} />
        </button>
      </div>

      {/* Desktop: Range slider */}
      <div className="hidden md:block">
        <div className="flex items-center gap-2">
          <label htmlFor="zoom-slider" className="text-sm font-medium">
            Zoom
          </label>
          <input
            id="zoom-slider"
            type="range"
            min={DEFAULT_ZOOM_MIN}
            max={DEFAULT_ZOOM_MAX}
            step={DEFAULT_ZOOM_STEP}
            defaultValue={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="range range-primary"
          />
        </div>
      </div>
    </div>
  );
};
