import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGame } from "../hooks/useGame";

/**
 * Component that handles navigation based on active meeple changes.
 * When a meeple is selected, it navigates to the /meeple/:id route.
 */
export function NavigationHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeMeeple } = useGame();
  const hasNavigatedRef = useRef(false);

  // Navigate to meeple detail route when activeMeeple changes
  useEffect(() => {
    if (activeMeeple) {
      const expectedPath = `/meeple/${activeMeeple.id}`;
      
      // Only navigate if we're not already on the correct route
      if (location.pathname !== expectedPath) {
        navigate(expectedPath, { replace: true });
        hasNavigatedRef.current = true;
      }
    } else if (hasNavigatedRef.current && location.pathname.startsWith("/meeple/")) {
      // If activeMeeple is cleared and we're on a meeple route, go back to home
      navigate("/", { replace: true });
      hasNavigatedRef.current = false;
    }
  }, [activeMeeple, navigate, location.pathname]);

  return null;
}

