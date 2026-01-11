export const Instructions = () => {
  return (
    <div className="w-xs p-4 space-y-4">
      <h1 className="text-2xl font-bold">Controls</h1>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Camera</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Arrow Keys</strong> - Move camera manually (player mode)
          </li>
          <li>
            <strong>Click meeple name in list</strong> - Select a meeple and lock camera to follow it (meeple mode)
            <br />
            <span className="text-xs opacity-75 italic">Note: Click on the meeple name in the meeple list, not on the canvas</span>
          </li>
          <li>
            <strong>Click back arrow</strong> - Return to player mode and view all meeples
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Navigation</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Use the <strong>role filter</strong> dropdown to filter meeples by role</li>
          <li>Click a meeple name in the list to view details and follow that meeple</li>
          <li>The camera indicator shows the current mode (player or meeple)</li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Simulation</h2>
        <p className="text-sm">
          Entities act autonomously based on inventory conditions. Miners mine and trade, 
          bartenders restock bars, asteroids generate minerals, and space stores convert resources.
        </p>
      </div>
    </div>
  );
};