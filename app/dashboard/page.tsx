import { redirect } from "next/navigation";
import { OrganizationCard } from "./organization-card";
import type { OrganizationWithDetails } from "@/features/auth/types";
import AccountSwitcher from "@/features/auth/components/account-switch";
import {
	getSession,
	getDeviceSessions,
	getActiveOrganization,
} from "@/features/auth/queries";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";

export default async function DashboardPage() {
	const [session, deviceSessions, organization] = await Promise.all([
		getSession(),
		getDeviceSessions(),
		getActiveOrganization(),
	]).catch((e) => {
		console.log(e);
		throw redirect("/sign-in");
	});
	return (
		<>
			<SiteHeader />
			<div className="flex flex-1 flex-col">
				<div className="@container/main flex flex-1 flex-col gap-2">
					<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						<SectionCards />
						<div className="px-4 lg:px-6">
							<ChartAreaInteractive />
						</div>
						<DataTable data={data} />
					</div>
				</div>
			</div>
		</>
	);
}
