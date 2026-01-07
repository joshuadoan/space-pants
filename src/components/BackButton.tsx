import { Link } from "react-router-dom";
import { IconComponent } from "../utils/iconMap";

export const BackButton = () => {
  return (
    <Link to="/" className="btn btn-ghost" aria-label="Back">
      <IconComponent icon="arrow-left" />
      Back
    </Link>
  );
};

