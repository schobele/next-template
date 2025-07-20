"use client";

import * as React from "react";
import {
	IconCamera,
	IconChartBar,
	IconDashboard,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconFolder,
	IconHelp,
	IconInnerShadowTop,
	IconListDetails,
	IconReport,
	IconSearch,
	IconSettings,
	IconUsers,
	IconChevronDown,
	IconPlus,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { organization, useListOrganizations } from "@/lib/auth/client";
import type { Session, OrganizationWithDetails } from "@/features/auth/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	session: Session | null;
	activeOrganization: OrganizationWithDetails | null;
}

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "#",
			icon: IconDashboard,
		},
		{
			title: "Lifecycle",
			url: "#",
			icon: IconListDetails,
		},
		{
			title: "Analytics",
			url: "#",
			icon: IconChartBar,
		},
		{
			title: "Projects",
			url: "#",
			icon: IconFolder,
		},
		{
			title: "Team",
			url: "#",
			icon: IconUsers,
		},
	],
	navClouds: [
		{
			title: "Capture",
			icon: IconCamera,
			isActive: true,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Proposal",
			icon: IconFileDescription,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Prompts",
			icon: IconFileAi,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: IconSettings,
		},
		{
			title: "Get Help",
			url: "#",
			icon: IconHelp,
		},
		{
			title: "Search",
			url: "#",
			icon: IconSearch,
		},
	],
	documents: [
		{
			name: "Data Library",
			url: "#",
			icon: IconDatabase,
		},
		{
			name: "Reports",
			url: "#",
			icon: IconReport,
		},
		{
			name: "Word Assistant",
			url: "#",
			icon: IconFileWord,
		},
	],
};

export function AppSidebar({
	session,
	activeOrganization,
	...props
}: AppSidebarProps) {
	const organizations = useListOrganizations();
	const router = useRouter();
	const [optimisticOrg, setOptimisticOrg] =
		useState<OrganizationWithDetails | null>(activeOrganization);

	useEffect(() => {
		setOptimisticOrg(activeOrganization);
	}, [activeOrganization]);

	const handleOrganizationSwitch = async (orgId: string | null) => {
		try {
			if (orgId === null) {
				await organization.setActive({ organizationId: null });
				setOptimisticOrg(null);
			} else {
				const org = organizations.data?.find((o) => o.id === orgId);
				if (org) {
					setOptimisticOrg({ ...org, members: [], invitations: [] });
					const { data } = await organization.setActive({
						organizationId: orgId,
					});
					if (data) {
						setOptimisticOrg(data as OrganizationWithDetails);
					}
				}
			}
			router.refresh();
		} catch (error) {
			toast.error("Failed to switch organization");
		}
	};

	const handleCreateOrganization = () => {
		router.push("/dashboard");
	};

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 w-full bg-accent">
									<div className="flex items-center gap-2 w-full">
										{optimisticOrg ? (
											<Avatar className="h-5 w-5">
												<AvatarImage src={optimisticOrg.logo || undefined} />
												<AvatarFallback className="text-xs">
													{optimisticOrg.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
										) : (
											<IconInnerShadowTop className="!size-5" />
										)}
										<span className="text-base font-semibold flex-1 text-left">
											{optimisticOrg?.name || "Personal"}
										</span>
										<IconChevronDown className="h-4 w-4 text-muted-foreground" />
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width]"
								align="start"
							>
								<DropdownMenuLabel className="text-xs text-muted-foreground">
									Organizations
								</DropdownMenuLabel>
								<DropdownMenuItem
									onClick={() => handleOrganizationSwitch(null)}
									className={!optimisticOrg ? "bg-accent" : ""}
								>
									<IconInnerShadowTop className="h-4 w-4 mr-2" />
									Personal
								</DropdownMenuItem>
								{organizations.data && organizations.data.length > 0 && (
									<DropdownMenuSeparator />
								)}
								{organizations.data?.map((org) => (
									<DropdownMenuItem
										key={org.id}
										onClick={() => handleOrganizationSwitch(org.id)}
										className={optimisticOrg?.id === org.id ? "bg-accent" : ""}
									>
										<Avatar className="h-4 w-4 mr-2">
											<AvatarImage src={org.logo || undefined} />
											<AvatarFallback className="text-xs">
												{org.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										{org.name}
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleCreateOrganization}>
									<IconPlus className="h-4 w-4 mr-2" />
									Create Organization
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavDocuments items={data.documents} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser session={session} activeOrganization={optimisticOrg} />
			</SidebarFooter>
		</Sidebar>
	);
}
