import Link from "next/link";
import { Home, Star } from "lucide-react";

const NavMenu = () => {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/members"
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      <Link
        href="/members/todays-pick"
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
      >
        <Star className="h-4 w-4" />
        Today's Pick
      </Link>
      <Link
        href="/members/search"
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
      >
        Search
      </Link>
    </div>
  );
};

export default NavMenu; 