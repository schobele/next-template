"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
// Removed unused import
import { client } from "@/lib/auth/client";

export default function MagicLinkSignIn() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	const handleSendMagicLink = async () => {
		if (!email) {
			toast.error("Please enter your email address");
			return;
		}

		setLoading(true);
		try {
			const { data, error } = await client.signIn.magicLink({
				email,
				callbackURL: "/dashboard",
				newUserCallbackURL: "/welcome",
				errorCallbackURL: "/error",
			});

			if (error) {
				toast.error(error.message);
			} else {
				setEmailSent(true);
				toast.success("Magic link sent! Check your email");
			}
		} catch (error) {
			toast.error("Failed to send magic link. Please try again.");
			console.error("Magic link error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="max-w-md">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">
					Sign In with Magic Link
				</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Enter your email and we'll send you a magic link to sign in
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{!emailSent ? (
						<>
							<div className="grid gap-2">
								<Label htmlFor="magic-email">Email</Label>
								<Input
									id="magic-email"
									type="email"
									placeholder="m@example.com"
									required
									onChange={(e) => {
										setEmail(e.target.value);
									}}
									value={email}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleSendMagicLink();
										}
									}}
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={loading}
								onClick={handleSendMagicLink}
							>
								{loading ? (
									<Loader2 size={16} className="animate-spin" />
								) : (
									<>
										<Mail className="mr-2 h-4 w-4" />
										Send Magic Link
									</>
								)}
							</Button>
						</>
					) : (
						<div className="text-center py-4">
							<Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
							<p className="text-sm text-muted-foreground">
								We've sent a magic link to <strong>{email}</strong>
							</p>
							<p className="text-sm text-muted-foreground mt-2">
								Click the link in your email to sign in.
							</p>
							<Button
								variant="link"
								className="mt-4"
								onClick={() => {
									setEmailSent(false);
									setEmail("");
								}}
							>
								Try a different email
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
