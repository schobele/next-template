import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import {
	admin,
	bearer,
	magicLink,
	multiSession,
	oAuthProxy,
	oneTap,
	openAPI,
	organization,
	twoFactor,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { db } from "@/lib/db";
import { reactInvitationEmail } from "@/lib/email/invitation";
import { reactMagicLinkEmail } from "@/lib/email/magic-link";
import { resend } from "@/lib/email/resend";
import { reactResetPasswordEmail } from "@/lib/email/reset-password";

const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";
const to = process.env.TEST_EMAIL || "";

export const auth = betterAuth({
	appName: "Spawn Bot",
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	emailVerification: {
		async sendVerificationEmail({ user, url }) {
			const res = await resend.emails.send({
				from,
				to: to || user.email,
				subject: "Verify your email address",
				html: `<a href="${url}">Verify your email address</a>`,
			});
			console.log(res, user.email);
		},
	},
	account: {
		accountLinking: {
			trustedProviders: ["google", "github", "demo-app"],
		},
	},
	emailAndPassword: {
		enabled: true,
		async sendResetPassword({ user, url }) {
			await resend.emails.send({
				from,
				to: user.email,
				subject: "Reset your password",
				react: reactResetPasswordEmail({
					username: user.email,
					resetLink: url,
				}),
			});
		},
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
		},
		google: {
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},
		microsoft: {
			clientId: process.env.MICROSOFT_CLIENT_ID || "",
			clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
		},
	},
	plugins: [
		magicLink({
			sendMagicLink: async ({ email, token, url }, request) => {
				console.log(email, token, url, request);
				await resend.emails.send({
					from,
					to: email,
					subject: "Magic Link Login",
					react: reactMagicLinkEmail({
						email: email,
						loginLink: url,
					}),
				});
			},
		}),
		organization({
			async sendInvitationEmail(data) {
				await resend.emails.send({
					from,
					to: data.email,
					subject: "You've been invited to join an organization",
					react: reactInvitationEmail({
						username: data.email,
						invitedByUsername: data.inviter.user.name,
						invitedByEmail: data.inviter.user.email,
						teamName: data.organization.name,
						inviteLink:
							process.env.NODE_ENV === "development"
								? `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${data.id}`
								: `${
										process.env.BETTER_AUTH_URL ||
										"https://demo.better-auth.com"
									}/accept-invitation/${data.id}`,
					}),
				});
			},
		}),
		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }) {
					await resend.emails.send({
						from,
						to: user.email,
						subject: "Your OTP",
						html: `Your OTP is ${otp}`,
					});
				},
			},
		}),
		passkey(),
		openAPI(),
		bearer(),
		admin({
			adminUserIds: ["EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB"],
		}),
		multiSession(),
		oAuthProxy(),
		oneTap(),
		nextCookies(),
	],
	trustedOrigins: ["exp://"],
});

export type { Session, User } from "better-auth/types";
