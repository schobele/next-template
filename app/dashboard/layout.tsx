import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession, getActiveOrganization } from "@/features/auth/queries";
import type { OrganizationWithDetails } from "@/features/auth/types";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [session, organization] = await Promise.all([
		getSession(),
		getActiveOrganization(),
	]);
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar 
				variant="inset" 
				session={JSON.parse(JSON.stringify(session))}
				activeOrganization={JSON.parse(JSON.stringify(organization)) as OrganizationWithDetails | null}
			/>
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
