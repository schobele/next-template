"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
	actionSuccess,
	actionError,
	type ActionResponse,
} from "@/lib/utils/actions";
import type {
	SignInFormData,
	SignUpFormData,
	ResetPasswordFormData,
	NewPasswordFormData,
	CreateOrganizationData,
	InviteMemberData,
	EnableTwoFactorData,
	VerifyTwoFactorData,
	EmailVerificationData,
	AuthActionResponse,
} from "./types";

// Authentication actions
export async function signInAction(
	data: SignInFormData
): Promise<ActionResponse<any>> {
	try {
		const result = await auth.api.signInEmail({
			body: {
				email: data.email,
				password: data.password,
				rememberMe: data.rememberMe,
			},
		});

		if (!result) {
			return actionError("Invalid credentials");
		}

		return actionSuccess(result);
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to sign in"
		);
	}
}

export async function signUpAction(
	data: SignUpFormData
): Promise<ActionResponse<any>> {
	try {
		const result = await auth.api.signUpEmail({
			body: {
				email: data.email,
				password: data.password,
				name: data.name || "",
			},
		});

		if (!result) {
			return actionError("Failed to create account");
		}

		return actionSuccess(result);
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to sign up"
		);
	}
}

export async function signOutAction(): Promise<ActionResponse<any>> {
	try {
		await auth.api.signOut({
			headers: await headers(),
		});

		return actionSuccess(null);
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to sign out"
		);
	}
}

// Password reset actions
export async function sendPasswordResetAction(
	data: ResetPasswordFormData
): Promise<ActionResponse<any>> {
	try {
		await auth.api.forgetPassword({
			body: {
				email: data.email,
				redirectTo: "/reset-password",
			},
		});

		return actionSuccess({ message: "Password reset email sent" });
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to send reset email"
		);
	}
}

export async function resetPasswordAction(
	data: NewPasswordFormData
): Promise<ActionResponse<any>> {
	try {
		await auth.api.resetPassword({
			body: {
				newPassword: data.password,
				token: data.token,
			},
		});

		return actionSuccess({ message: "Password reset successfully" });
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to reset password"
		);
	}
}

// Email verification actions
export async function sendVerificationEmailAction(
	email: string
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		await auth.api.sendVerificationEmail({
			headers: headersList,
			body: {
				email,
				callbackURL: "/dashboard",
			},
		});

		return actionSuccess({ message: "Verification email sent" });
	} catch (error) {
		return actionError(
			error instanceof Error
				? error.message
				: "Failed to send verification email"
		);
	}
}

export async function verifyEmailAction(
	data: EmailVerificationData
): Promise<ActionResponse<any>> {
	try {
		await auth.api.verifyEmail({
			query: {
				token: data.token,
			},
		});

		return actionSuccess({ message: "Email verified successfully" });
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to verify email"
		);
	}
}

// Organization actions
export async function createOrganizationAction(
	data: CreateOrganizationData
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		const result = await auth.api.createOrganization({
			headers: headersList,
			body: {
				name: data.name,
				slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
			},
		});

		return actionSuccess(result);
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to create organization"
		);
	}
}

export async function inviteOrganizationMemberAction(
	organizationId: string,
	data: InviteMemberData
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		const result = await auth.api.createInvitation({
			headers: headersList,
			body: {
				organizationId,
				email: data.email,
				role: data.role as "admin" | "member" | "owner",
			},
		});

		revalidatePath("/dashboard");
		return actionSuccess(result);
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to invite member"
		);
	}
}

export async function acceptInvitationAction(
	invitationId: string
): Promise<ActionResponse<any>> {
	// TODO: Organization accept invitation functionality not available in current setup
	return actionError("Accept invitation functionality not implemented");
}

export async function updateOrganizationAction(
	organizationId: string,
	data: Partial<CreateOrganizationData>
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		const result = await auth.api.updateOrganization({
			headers: headersList,
			body: {
				organizationId,
				data,
			},
		});

		revalidatePath("/dashboard");
		return actionSuccess(result);
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to update organization"
		);
	}
}

export async function deleteOrganizationAction(
	organizationId: string
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		await auth.api.deleteOrganization({
			headers: headersList,
			body: { organizationId },
		});

		revalidatePath("/dashboard");
		return actionSuccess({ message: "Organization deleted successfully" });
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to delete organization"
		);
	}
}

export async function removeMemberAction(
	organizationId: string,
	memberIdOrEmail: string
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		await auth.api.removeMember({
			headers: headersList,
			body: {
				organizationId,
				memberIdOrEmail,
			},
		});

		revalidatePath("/dashboard");
		return actionSuccess({ message: "Member removed successfully" });
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to remove member"
		);
	}
}

export async function updateMemberRoleAction(
	organizationId: string,
	memberId: string,
	role: "admin" | "member" | "owner"
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		const result = await auth.api.updateMemberRole({
			headers: headersList,
			body: {
				organizationId,
				memberId,
				role,
			},
		});

		revalidatePath("/dashboard");
		return actionSuccess(result);
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to update member role"
		);
	}
}

export async function cancelInvitationAction(
	invitationId: string
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		await auth.api.cancelInvitation({
			headers: headersList,
			body: { invitationId },
		});

		revalidatePath("/dashboard");
		return actionSuccess({ message: "Invitation cancelled successfully" });
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to cancel invitation"
		);
	}
}

export async function setActiveOrganizationAction(
	organizationId: string
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		await auth.api.setActiveOrganization({
			headers: headersList,
			body: { organizationId },
		});

		revalidatePath("/dashboard");
		return actionSuccess({ message: "Active organization updated" });
	} catch (error) {
		return actionError(
			error instanceof Error
				? error.message
				: "Failed to set active organization"
		);
	}
}

// Two-factor authentication actions
export async function enableTwoFactorAction(
	data: EnableTwoFactorData
): Promise<ActionResponse<any>> {
	// TODO: Two-factor functionality not available in current setup
	return actionError("Two-factor functionality not implemented");
}

export async function verifyTwoFactorAction(
	data: VerifyTwoFactorData
): Promise<ActionResponse<any>> {
	// TODO: Two-factor functionality not available in current setup
	return actionError("Two-factor functionality not implemented");
}

export async function disableTwoFactorAction(
	password: string
): Promise<ActionResponse<any>> {
	// TODO: Two-factor functionality not available in current setup
	return actionError("Two-factor functionality not implemented");
}

// Session management actions
export async function revokeSessionAction(
	sessionId: string
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		await auth.api.revokeSession({
			headers: headersList,
			body: {
				token: sessionId,
			},
		});

		return actionSuccess({ message: "Session revoked successfully" });
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to revoke session"
		);
	}
}

export async function revokeAllSessionsAction(): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		await auth.api.revokeSessions({
			headers: headersList,
		});

		return actionSuccess({ message: "All sessions revoked successfully" });
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to revoke sessions"
		);
	}
}

// Account management actions
export async function updateAccountAction(data: {
	name?: string;
	email?: string;
}): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		const result = await auth.api.updateUser({
			headers: headersList,
			body: data,
		});

		return actionSuccess(result);
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to update account"
		);
	}
}

export async function deleteAccountAction(
	password: string
): Promise<ActionResponse<any>> {
	try {
		const headersList = await headers();
		await auth.api.deleteUser({
			headers: headersList,
			body: {
				password,
			},
		});

		return actionSuccess({ message: "Account deleted successfully" });
	} catch (error) {
		return actionError(
			error instanceof Error ? error.message : "Failed to delete account"
		);
	}
}

// Passkey actions
export async function registerPasskeyAction(
	name: string
): Promise<ActionResponse<any>> {
	// TODO: Passkey functionality not available in current setup
	return actionError("Passkey functionality not implemented");
}

export async function deletePasskeyAction(
	passkeyId: string
): Promise<ActionResponse<any>> {
	// TODO: Passkey functionality not available in current setup
	return actionError("Passkey functionality not implemented");
}
