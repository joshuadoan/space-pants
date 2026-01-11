export const Instructions = () => {
  return (
    <div className="w-xs p-4 space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold">Instructions</h1>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Game Summary</h2>
        <p className="text-sm">
          Space Pants is an autonomous space economy simulation. Watch as miners, bartenders, 
          space stores, and other entities interact in a dynamic economy. Each entity acts 
          autonomously based on their inventory conditions, creating an emergent economic system.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Controls</h2>
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
          <li>Use the <strong>role filter</strong> dropdown to filter meeples by role</li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Economy</h2>
        <div className="space-y-3 text-sm">
          <div>
            <h3 className="font-semibold mb-1">Resources</h3>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Minerals (Ore)</strong> - Mined from asteroids</li>
              <li><strong>Money</strong> - Earned from trading</li>
              <li><strong>Fizzy Drinks</strong> - Consumable beverages</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Trading Flow</h3>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Miners</strong>: Mine ore → Sell to Space Stores (1 ore = 2 money) → Buy fizzy drinks (1 money) → Consume</li>
              <li><strong>Space Stores</strong>: Convert ore to fizzy drinks and money (1 ore → 10 fizzy + 10 money)</li>
              <li><strong>Bartenders</strong>: Buy fizzy from stores (1 money) → Restock bars (earn 2 money per fizzy)</li>
              <li><strong>Asteroids</strong>: Regenerate ore when inventory is low</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};