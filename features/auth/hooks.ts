"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	signIn,
	signOut,
	signUp,
	useSession as useBetterAuthSession,
	organization,
	useListOrganizations,
	useActiveOrganization,
	twoFactor,
	passkey,
} from "@/lib/auth/client";
import type {
	SignInFormData,
	SignUpFormData,
	SocialProvider,
	AuthState,
	MagicLinkData,
} from "./types";

// Core authentication hook
export function useAuth() {
	const router = useRouter();
	const { data: session, error, isPending } = useBetterAuthSession();

	const authState: AuthState = {
		isAuthenticated: !!session,
		isLoading: isPending,
		session,
		user: session?.user || null,
		activeOrganization: null, // TODO: Get from useActiveOrganization hook
	};

	const handleSignIn = useCallback(
		async (data: SignInFormData) => {
			try {
				const result = await signIn.email({
					email: data.email,
					password: data.password,
					rememberMe: data.rememberMe,
				});

				if (result.data) {
					toast.success("Signed in successfully");
					router.push("/dashboard");
				}
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to sign in"
				);
				throw error;
			}
		},
		[router]
	);

	const handleSignUp = useCallback(
		async (data: SignUpFormData) => {
			try {
				const result = await signUp.email({
					email: data.email,
					password: data.password,
					name: data.name || "",
				});

				if (result.data) {
					toast.success("Account created successfully");
					router.push("/dashboard");
				}
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to sign up"
				);
				throw error;
			}
		},
		[router]
	);

	const handleSignOut = useCallback(async () => {
		try {
			await signOut();
			toast.success("Signed out successfully");
			router.push("/");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to sign out"
			);
			throw error;
		}
	}, [router]);

	const handleSocialSignIn = useCallback(async (provider: SocialProvider) => {
		try {
			await signIn.social({
				provider,
				callbackURL: "/dashboard",
			});
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: `Failed to sign in with ${provider}`
			);
			throw error;
		}
	}, []);

	return {
		...authState,
		signIn: handleSignIn,
		signUp: handleSignUp,
		signOut: handleSignOut,
		socialSignIn: handleSocialSignIn,
		error,
	};
}

// Session management hook
export function useSession() {
	return useBetterAuthSession();
}

// Magic link authentication hook
export function useMagicLink() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const sendMagicLink = useCallback(async (data: MagicLinkData) => {
		setIsLoading(true);
		try {
			await signIn.magicLink({
				email: data.email,
				callbackURL: data.callbackURL || "/dashboard",
			});
			toast.success("Magic link sent to your email");
			return true;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to send magic link"
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		sendMagicLink,
		isLoading,
	};
}

// Two-factor authentication hook
export function useTwoFactor() {
	const [isLoading, setIsLoading] = useState(false);

	const verifyTwoFactor = useCallback(async (code: string) => {
		setIsLoading(true);
		try {
			await twoFactor.verifyTotp({
				code,
			});
			toast.success("Two-factor authentication successful");
			return true;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Invalid two-factor code"
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		verifyTwoFactor,
		isLoading,
	};
}

// Organization management hooks
export function useOrganization() {
	const { data: organizations, error, isPending } = useListOrganizations();
	const { data: activeOrg } = useActiveOrganization();
	const [isLoading, setIsLoading] = useState(false);

	const createOrganization = useCallback(
		async (name: string, slug?: string) => {
			setIsLoading(true);
			try {
				const result = await organization.create({
					name,
					slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
				});
				toast.success("Organization created successfully");
				return result;
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to create organization"
				);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const switchOrganization = useCallback(async (organizationId: string) => {
		setIsLoading(true);
		try {
			await organization.setActive({
				organizationId,
			});
			toast.success("Switched organization successfully");
			window.location.reload();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to switch organization"
			);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const inviteMember = useCallback(
		async (email: string, role: "member" | "admin" | "owner") => {
			setIsLoading(true);
			try {
				const result = await organization.inviteMember({
					email,
					role,
					organizationId: activeOrg?.id || "",
				});
				toast.success("Invitation sent successfully");
				return result;
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to invite member"
				);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[activeOrg?.id]
	);

	return {
		organizations: organizations || [],
		activeOrganization: activeOrg,
		isLoading: isPending || isLoading,
		error,
		createOrganization,
		switchOrganization,
		inviteMember,
	};
}

// Passkey authentication hook
export function usePasskey() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const signInWithPasskey = useCallback(async () => {
		setIsLoading(true);
		try {
			await signIn.passkey();
			toast.success("Signed in with passkey");
			router.push("/dashboard");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to sign in with passkey"
			);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, [router]);

	const registerPasskey = useCallback(async (name: string) => {
		setIsLoading(true);
		try {
			await passkey.addPasskey({
				name,
			});
			toast.success("Passkey registered successfully");
			return true;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to register passkey"
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		signInWithPasskey,
		registerPasskey,
		isLoading,
	};
}

// Auth redirect hook
export function useAuthRedirect(redirectTo = "/dashboard") {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.push(redirectTo);
		}
	}, [isAuthenticated, redirectTo, router]);
}

// Protected route hook
export function useRequireAuth(redirectTo = "/sign-in") {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push(redirectTo);
		}
	}, [isAuthenticated, isLoading, redirectTo, router]);

	return { isAuthenticated, isLoading };
}

// Account management hook
export function useAccount() {
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const updateAccount = useCallback(
		async (data: { name?: string; email?: string }) => {
			setIsLoading(true);
			try {
				// This would need to be implemented in the client
				// For now, just show a message
				toast.info("Account update functionality coming soon");
				return true;
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to update account"
				);
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const deleteAccount = useCallback(async () => {
		setIsLoading(true);
		try {
			// This would need to be implemented in the client
			// For now, just show a message
			toast.info("Account deletion functionality coming soon");
			return true;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to delete account"
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		user,
		updateAccount,
		deleteAccount,
		isLoading,
	};
}

// Session management hook
export function useSessionManagement() {
	const [sessions, setSessions] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchSessions = useCallback(async () => {
		setIsLoading(true);
		try {
			// This would need to be implemented in the client
			// For now, return empty array
			setSessions([]);
		} catch (error) {
			toast.error("Failed to fetch sessions");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const revokeSession = useCallback(async (sessionId: string) => {
		setIsLoading(true);
		try {
			// This would need to be implemented in the client
			toast.info("Session revocation functionality coming soon");
			return true;
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to revoke session"
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSessions();
	}, [fetchSessions]);

	return {
		sessions,
		revokeSession,
		refreshSessions: fetchSessions,
		isLoading,
	};
}
