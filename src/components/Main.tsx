import { useGame } from "../Game/useGame";
import { MeepleRoles } from "../types";
import { MeepleListItem } from "./MeepleListItem";
import { Detail } from "./Detail";
import { Link, useParams } from "react-router-dom";
import { BackButton } from "./BackButton";
import { useEffect } from "react";
import cx from "classnames";

export const Main = () => {
  const { hasStarted, meeples, setFilterBy, filterBy, lockCameraToMeeple } =
    useGame();
  const { meepleId } = useParams();
  const selectedMeeple = meeples.find(
    (meeple) => meeple.id.toString() === meepleId
  );

  useEffect(() => {
    if (selectedMeeple) {
      lockCameraToMeeple(selectedMeeple);
    }
  }, [selectedMeeple]);

  if (!hasStarted) {
    return <div>Loading...</div>;
  }

  if (!selectedMeeple && meepleId && !hasStarted) {
    return (
      <div className="p-4">
        <BackButton />
        <div className="p-4">Meeple not found.</div>
        <Link to="/" className="btn btn-primary">
          Back to main page
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full">
      {!selectedMeeple && (
        <select
          defaultValue={filterBy || "Pick a Framework"}
          className="select select-info"
          onChange={(e) =>
            setFilterBy(
              e.target.value === "" ? null : (e.target.value as MeepleRoles)
            )
          }
        >
          <option disabled={true}>Pick a Role</option>
          <option value="">All</option>
          {Object.values(MeepleRoles).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      )}
      <ul
        // className="list bg-base-100 rounded-box shadow-md w-xs h-full overflow-y-auto"
        className={cx(
          "list bg-base-100 rounded-box shadow-md w-xs h-full",
          selectedMeeple ? "" : "overflow-y-auto"
        )}
      >
        {meeples
          .filter((meeple) => {
            if (filterBy) {
              return meeple.roleId === filterBy;
            }
            if (selectedMeeple) {
              return meeple.id === selectedMeeple.id;
            }
            return false;
          })
          .map((meeple) => (
            <div key={meeple.id} className="h-full">
              <MeepleListItem key={meeple.id} meeple={meeple} />
              {selectedMeeple?.id === meeple.id && (
                <Detail
                  inventory={meeple.inventory}
                  actionsHistory={meeple.actionsHistory}
                  conditions={meeple.conditions}
                  evaluateCondition={(condition) =>
                    meeple.evaluateCondition(condition)
                  }
                />
              )}
            </div>
          ))}
      </ul>
    </div>
  );
};
