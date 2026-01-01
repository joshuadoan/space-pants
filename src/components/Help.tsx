export const Help = () => {
  return (
    <div className="flex flex-col h-full p-2 overflow-y-auto">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">How to Use Space Pants</h1>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">What is Space Pants?</h2>
          <p className="text-sm">
            Space Pants is a real-time space economy simulation. Watch autonomous miners 
            mine ore from asteroids and trade it at space stores. All entities follow 
            rule-based AI behavior that determines their actions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Navigation</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Meeples tab:</strong> View and manage all entities in the game</li>
            <li><strong>Help tab:</strong> View this help information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Viewing Entities</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Use the filter tabs (All, Miner, Asteroid, etc.) to filter entities by type</li>
            <li>Click on any entity name to zoom the camera to that entity</li>
            <li>Click "Back" to return to the full entity list</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Inspecting Entities</h2>
          <p className="text-sm mb-2">When viewing a selected entity, you'll see:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Stats & Inventory:</strong> Detailed inventory (ore, money, products) and stats (health, energy, happiness) are shown automatically in the entity card</li>
            <li><strong>Rules tab:</strong> See all rules that control the entity's behavior and which rules are currently active</li>
            <li><strong>Journal tab:</strong> View a history of the entity's actions and state changes over time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Controls</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Zoom Slider:</strong> Adjust the camera zoom level (top right)</li>
            <li><strong>Hide/Show UI:</strong> Toggle UI visibility for a cleaner view (top left)</li>
            <li><strong>Resource Badges:</strong> View total resources across all entities (top navigation)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How It Works</h2>
          <p className="text-sm">
            Entities evaluate their rules every 500ms based on their current state (idle, 
            traveling, visiting, or transacting). Rules check conditions like inventory 
            levels and stats, then execute actions like traveling to an asteroid or 
            trading at a space store. Miners automatically mine ore from asteroids and 
            trade it for money at space stores.
          </p>
        </section>
      </div>
    </div>
  );
};

