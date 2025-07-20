import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import type { Session, Organization } from "./types";

// Session queries
export const getSession = cache(async (): Promise<Session | null> => {
	try {
		const headersList = await headers();
		const session = await auth.api.getSession({
			headers: headersList,
		});
		return session;
	} catch (error) {
		console.error("Failed to get session:", error);
		return null;
	}
});

export const getUser = cache(async () => {
	const session = await getSession();
	return session?.user || null;
});

export const isAuthenticated = cache(async (): Promise<boolean> => {
	const session = await getSession();
	return !!session;
});

// Organization queries
export const getActiveOrganization = cache(async () => {
	try {
		const headersList = await headers();
		const organization = await auth.api.getFullOrganization({
			headers: headersList,
		});
		return organization;
	} catch (error) {
		console.error("Failed to get organization:", error);
		return null;
	}
});

// Organization queries
export const getFullOrganization = cache(async (organizationId?: string) => {
	try {
		const headersList = await headers();
		const result = await auth.api.listInvitations({
			headers: headersList,
		});
		return result || [];
	} catch (error) {
		console.error("Failed to get invitations:", error);
		return [];
	}
});

// Session management queries
export const getActiveSessions = cache(async () => {
	try {
		const headersList = await headers();
		const result = await auth.api.listSessions({
			headers: headersList,
		});
		return result || [];
	} catch (error) {
		console.error("Failed to get active sessions:", error);
		return [];
	}
});

export const getDeviceSessions = cache(async () => {
	try {
		const headersList = await headers();
		const result = await auth.api.listDeviceSessions({
			headers: headersList,
		});
		return result || [];
	} catch (error) {
		console.error("Failed to get device sessions:", error);
		return [];
	}
});

// Two-factor queries
export const getTwoFactorStatus = cache(async () => {
	try {
		const user = await getUser();
		if (!user) return { enabled: false, verified: false };

		// Check if user has two-factor enabled
		const session = await getSession();
		return {
			enabled: session?.user?.twoFactorEnabled || false,
			verified: true,
		};
	} catch (error) {
		console.error("Failed to get two-factor status:", error);
		return { enabled: false, verified: false };
	}
});

// Passkey queries
export const getUserPasskeys = cache(async () => {
	try {
		// Passkey API methods are not available on the server side
		// This would need to be implemented as a separate API route
		return [];
	} catch (error) {
		console.error("Failed to get passkeys:", error);
		return [];
	}
});

// Email verification status
export const getEmailVerificationStatus = cache(async () => {
	try {
		const user = await getUser();
		return {
			verified: user?.emailVerified || false,
			email: user?.email || null,
		};
	} catch (error) {
		console.error("Failed to get email verification status:", error);
		return { verified: false, email: null };
	}
});

// Admin queries
export const isAdmin = cache(async (): Promise<boolean> => {
	try {
		const session = await getSession();
		// Check if user is in the admin list configured in auth
		return session?.user?.id === "EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB";
	} catch (error) {
		console.error("Failed to check admin status:", error);
		return false;
	}
});

// Helper queries
export const checkSessionCookie = (headersList: Headers): boolean => {
	const cookieHeader = headersList.get("cookie");
	return (
		cookieHeader?.includes("better-auth.session") ||
		cookieHeader?.includes("__Secure-better-auth.session-token") ||
		false
	);
};

// Organization member queries
export const getOrganizationMembers = cache(async (organizationId?: string) => {
	try {
		const orgId = organizationId || (await getActiveOrganization())?.id;
		if (!orgId) return [];

		// Members are included in the full organization data
		const org = await getActiveOrganization();
		return org?.members || [];
	} catch (error) {
		console.error("Failed to get organization members:", error);
		return [];
	}
});

export const getOrganizationInvitations = cache(
	async (organizationId: string) => {
		try {
			const headersList = await headers();
			const invitations = await auth.api.listInvitations({
				query: { organizationId },
				headers: headersList,
			});
			return invitations || [];
		} catch (error) {
			console.error("Failed to get organization invitations:", error);
			return [];
		}
	}
);

export const getUserOrganizations = cache(async () => {
	try {
		const headersList = await headers();
		const organizations = await auth.api.listOrganizations({
			headers: headersList,
		});
		return organizations || [];
	} catch (error) {
		console.error("Failed to get user organizations:", error);
		return [];
	}
});

// Account linking queries
export const getLinkedAccounts = cache(async () => {
	try {
		const session = await getSession();
		if (!session) return [];

		// This would need to be implemented based on your account linking setup
		// For now, return empty array as placeholder
		return [];
	} catch (error) {
		console.error("Failed to get linked accounts:", error);
		return [];
	}
});
