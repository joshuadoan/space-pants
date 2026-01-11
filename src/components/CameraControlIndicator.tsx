import { IconCamera, IconArrowUp, IconArrowDown, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

interface CameraControlIndicatorProps {
  cameraControl: "player" | "meeple" | null;
}

export const CameraControlIndicator = ({
  cameraControl,
}: CameraControlIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          cameraControl === "player"
            ? "bg-blue-500/20 text-blue-300 border border-blue-500/50"
            : cameraControl === "meeple"
            ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
            : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
        }`}
      >
        <>
          <IconCamera size={16} className="animate-pulse" />
          <span className="flex items-center gap-1">
            {cameraControl === "player" ? (
              <>
                <span className="mr-1">Keyboard controls:</span>
                <IconArrowUp size={16} />
                <IconArrowDown size={16} />
                <IconArrowLeft size={16} />
                <IconArrowRight size={16} />
              </>
            ) : cameraControl === "meeple" ? (
              "Following the selected meeple"
            ) : null}
          </span>
        </>
      </div>
    </div>
  );
};
