import { ThemeToggle } from "@/components/theme-toggle";
import SideBar from "@/components/side-bar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavBarProps {
  title?: string;
  className?: string;
}

const NavBar = ( { title, className }: NavBarProps ) => {
  return (
    <div className="flex items-center px-3 py-2 shadow-md">

      {/* Left: Sidebar + Note */ }
      <div className="flex items-center gap-x-2">
        <SideBar/>
        <Link href={ '/' } className="text-xl text-primary uppercase font-medium">
          Notes
        </Link>
      </div>

      {/* Middle: Title */ }
      <div className={ cn( "flex-1 text-center text-sm truncate px-4 mr-24", className ) }>
        { title }
      </div>

      {/* Right: Theme Toggle */ }
      <ThemeToggle/>
    </div>
  );
};

export default NavBar;
