"use client";

import {
	IconBuilding,
	IconCreditCard,
	IconDotsVertical,
	IconLogout,
	IconNotification,
	IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth/client";
import type { Session, OrganizationWithDetails } from "@/features/auth/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NavUser({
	session,
	activeOrganization,
}: {
	session: Session | null;
	activeOrganization: OrganizationWithDetails | null;
}) {
	const { isMobile } = useSidebar();
	const router = useRouter();

	if (!session?.user) return null;

	const user = session.user;
	const currentMember = activeOrganization?.members?.find(
		(member) => member.userId === user.id
	);

	const handleSignOut = async () => {
		try {
			await signOut();
			router.push("/sign-in");
		} catch (error) {
			toast.error("Failed to sign out");
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-accent"
						>
							<Avatar className="h-8 w-8 rounded-lg grayscale">
								<AvatarImage
									src={user.image || undefined}
									alt={user.name || user.email}
								/>
								<AvatarFallback className="rounded-lg">
									{user.name?.charAt(0) || user.email.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{user.name || user.email}
								</span>
								<span className="text-muted-foreground truncate text-xs">
									{user.email}
								</span>
							</div>
							<IconDotsVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.image || undefined}
										alt={user.name || user.email}
									/>
									<AvatarFallback className="rounded-lg">
										{user.name?.charAt(0) || user.email.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.name || user.email}
									</span>
									<span className="text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						{activeOrganization && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<IconBuilding className="h-4 w-4 text-muted-foreground" />
										<div className="flex items-center gap-2 flex-1">
											<span className="text-xs text-muted-foreground">
												{activeOrganization.name}
											</span>
											{currentMember && (
												<Badge
													variant="outline"
													className="h-4 text-[10px] px-1"
												>
													{currentMember.role}
												</Badge>
											)}
										</div>
									</div>
								</DropdownMenuLabel>
							</>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<IconUserCircle />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconCreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconNotification />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut}>
							<IconLogout />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
