import type { client } from "@/lib/auth/client";
import type { auth } from "@/lib/auth";

// Re-export auth types from lib
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
export type ActiveOrganization = typeof client.$Infer.ActiveOrganization;
export type Organization = typeof client.$Infer.Organization;
export type Invitation = typeof client.$Infer.Invitation;

// Auth state types
export interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	session: Session | null;
	user: User | null;
	activeOrganization: ActiveOrganization | null;
}

// Form types
export interface SignInFormData {
	email: string;
	password: string;
	rememberMe?: boolean;
}

export interface SignUpFormData {
	email: string;
	password: string;
	name?: string;
}

export interface ResetPasswordFormData {
	email: string;
}

export interface NewPasswordFormData {
	password: string;
	confirmPassword: string;
	token: string;
}

export interface TwoFactorFormData {
	code: string;
}

// Action response types
export interface AuthActionResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
}

// Provider types
export type SocialProvider = "google" | "github" | "microsoft";

// Email verification types
export interface EmailVerificationData {
	email: string;
	token: string;
}

// Magic link types
export interface MagicLinkData {
	email: string;
	callbackURL?: string;
}

// Organization types
export interface CreateOrganizationData {
	name: string;
	slug?: string;
}

export interface InviteMemberData {
	email: string;
	role: "member" | "admin" | "owner";
	organizationId: string;
}

// Two-factor types
export interface EnableTwoFactorData {
	password: string;
}

export interface VerifyTwoFactorData {
	code: string;
	type: "totp" | "backup";
}

// Session types
export interface DeviceSession {
	id: string;
	userAgent?: string;
	ipAddress?: string;
	lastActive: Date;
	current: boolean;
}

// Passkey types
export interface PasskeyRegistrationData {
	name: string;
}

// Organization types
export interface OrganizationWithDetails extends Organization {
	members?: MemberWithUser[];
	invitations?: InvitationData[];
}

export interface MemberWithUser {
	id: string;
	email: string;
	role: string;
	createdAt: Date;
	userId: string;
	organizationId: string;
	user: User;
}

export interface InvitationData {
	id: string;
	email: string;
	role: string;
	status: "pending" | "accepted" | "rejected" | "canceled";
	expiresAt: Date;
	inviterId: string;
	organizationId: string;
}

export interface OrganizationFormData {
	name: string;
	slug: string;
	metadata?: Record<string, unknown>;
}

export interface InviteMemberFormData {
	email: string;
	role: string;
}

export interface RemoveMemberFormData {
	memberIdOrEmail: string;
}

export interface UpdateMemberRoleFormData {
	memberId: string;
	role: string;
}

export interface UpdateOrganizationFormData {
	organizationId: string;
	data: Partial<OrganizationFormData>;
}
