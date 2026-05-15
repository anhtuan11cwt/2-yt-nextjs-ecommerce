"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

import AdminSearch from "./admin-search";
import ThemeSwitcher from "./ThemeSwitcher";
import UserDropdown from "./UserDropdown";

// Topbar admin: search, theme, user dropdown
const Topbar = () => {
	const { toggleSidebar } = useSidebar();

	return (
		<header
			className="
        sticky
        top-0
        z-30
        h-[70px]
        border-b
        bg-background/95
        backdrop-blur
      "
		>
			<div
				className="
          flex
          items-center
          justify-between
          h-full
          px-4
          md:px-6
          transition-all
        "
			>
				{/* LEFT */}
				<div className="flex items-center gap-3">
					{/* MOBILE SIDEBAR TOGGLE */}
					<Button
						className="md:hidden"
						onClick={toggleSidebar}
						size="icon"
						variant="outline"
					>
						<Menu className="w-5 h-5" />
					</Button>

					<div className="hidden md:block w-64">
						<AdminSearch />
					</div>
				</div>

				{/* RIGHT */}
				<div className="flex items-center gap-3">
					<ThemeSwitcher />
					<UserDropdown />
				</div>
			</div>
		</header>
	);
};

export default Topbar;
