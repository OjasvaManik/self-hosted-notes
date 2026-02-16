import { ThemeToggle } from "@/components/theme-toggle";
import SideBar from "@/components/side-bar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavBarProps {
  title?: string;
  className?: string;
  emoji?: string;
}

const NavBar = ( { title, className, emoji }: NavBarProps ) => {
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
      <div className={ cn( "flex-1 text-center text-md truncate px-4 mr-24", className ) }>
        { emoji } { title }
      </div>

      {/* Right: Theme Toggle */ }
      <ThemeToggle/>
    </div>
  );
};

export default NavBar;
