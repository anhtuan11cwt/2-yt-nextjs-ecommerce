"use client";
import { ChevronRight, LayoutGrid, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { adminSidebarMenu } from "@/lib/adminSidebarMenu";

const AppSidebar = () => {
	const pathname = usePathname();
	const { toggleSidebar } = useSidebar();

	return (
		<Sidebar collapsible="icon">
			{/* HEADER */}
			<SidebarHeader className="border-b h-16 flex items-center px-4">
				<div className="flex items-center justify-between w-full">
					{/* LOGO */}
					<Link
						className="flex items-center gap-2 font-bold text-xl"
						href="/admin/dashboard"
					>
						<LayoutGrid className="w-8 h-8 text-primary" />
						<span>Bảng quản trị</span>
					</Link>
					{/* MOBILE CLOSE */}
					<button className="md:hidden" onClick={toggleSidebar} type="button">
						<PanelLeftClose className="w-5 h-5" />
					</button>
				</div>
			</SidebarHeader>

			{/* CONTENT */}
			<SidebarContent className="px-2">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{adminSidebarMenu.map((menu) => {
								// MENU WITHOUT SUBMENU
								if (!menu.subMenu) {
									const isActive = pathname === menu.url;
									return (
										<SidebarMenuItem key={menu.title}>
											<SidebarMenuButton
												asChild
												className="h-11 rounded-xl transition-all duration-200"
												isActive={isActive}
											>
												<Link
													className="flex items-center gap-3"
													href={menu.url}
												>
													<menu.icon className="w-5 h-5" />
													<span>{menu.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								}

								// MENU WITH SUBMENU
								return (
									<Collapsible className="group/collapsible" key={menu.title}>
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton className="h-11 rounded-xl transition-all duration-200">
													<menu.icon className="w-5 h-5" />
													<span>{menu.title}</span>
													<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<div className="ml-4 mt-1 space-y-1 border-l pl-3">
													{menu.subMenu.map((sub) => {
														const isSubActive = pathname === sub.url;
														return (
															<SidebarMenuButton
																asChild
																className="h-10 rounded-lg"
																isActive={isSubActive}
																key={sub.title}
															>
																<Link
																	className="flex items-center gap-3"
																	href={sub.url}
																>
																	<sub.icon className="w-4 h-4" />
																	<span>{sub.title}</span>
																</Link>
															</SidebarMenuButton>
														);
													})}
												</div>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
};

export default AppSidebar;
