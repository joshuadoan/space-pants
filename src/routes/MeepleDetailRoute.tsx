import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ACTION_ICONS } from "../utils/iconMap";
import { useGame } from "../hooks/useGame";
import { MeepleCard } from "../components/MeepleCard";

export function MeepleDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { meeples, zoomToEntity } = useGame();

  const handleBack = () => {
    // Clear active meeple when going back
    zoomToEntity(null);
    navigate("/");
  };

  // Find the meeple by ID
  const meeple = meeples.find((m) => String(m.id) === id);

  // Handle meeple not found and zoom to meeple
  useEffect(() => {
    if (!meeple) {
      if (meeples.length > 0) {
        navigate("/");
      }
      return;
    }
    zoomToEntity(meeple);
  }, [meeple, meeples.length, navigate, zoomToEntity]);

  if (!meeple) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-base-content/70 mb-4">Meeple not found</p>
          <button
            onClick={handleBack}
            className="btn btn-primary"
          >
            <ACTION_ICONS.back size={16} />
            Back to Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="w-full max-w-2xl p-4">
        <div className="mb-3">
          <button
            onClick={handleBack}
            className="btn btn-outline btn-sm"
          >
            <ACTION_ICONS.back size={16} />
            Back to Game
          </button>
        </div>
        <div className="card bg-base-100 shadow-lg border border-base-300 rounded-lg p-4">
          <MeepleCard
            meeple={meeple}
            onMeepleNameClick={() => zoomToEntity(meeple)}
            isSelected={true}
          />
        </div>
      </div>
    </div>
  );
}

