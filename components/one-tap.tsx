"use client";

import { Key, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { client, signIn } from "@/lib/auth/client";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PasswordInput } from "@/components/ui/password-input";

export function OneTap() {
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		client.oneTap({
			onPromptNotification(notification) {
				setIsOpen(true);
			},
		});
	}, []);
	return (
		<Dialog onOpenChange={(change) => setIsOpen(change)} open={isOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-lg md:text-xl">Sign In</DialogTitle>
					<DialogDescription className="text-xs md:text-sm">
						Enter your email below to login to your account
					</DialogDescription>
				</DialogHeader>
				<SignInBox />
			</DialogContent>
		</Dialog>
	);
}

function SignInBox() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	return (
		<div className="grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setEmail(e.target.value);
					}}
					placeholder="m@example.com"
					required
					type="email"
					value={email}
				/>
			</div>
			<div className="grid gap-2">
				<div className="flex items-center">
					<Label htmlFor="password">Password</Label>
					<Link
						className="ml-auto inline-block text-sm underline"
						href="/forget-password"
					>
						Forgot your password?
					</Link>
				</div>
				<PasswordInput
					autoComplete="password"
					id="password"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setPassword(e.target.value)
					}
					placeholder="Password"
					value={password}
				/>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox
					onClick={() => {
						setRememberMe(!rememberMe);
					}}
				/>
				<Label>Remember me</Label>
			</div>

			<Button
				className="w-full"
				disabled={loading}
				onClick={async () => {
					await signIn.email(
						{
							email,
							password,
							callbackURL: "/dashboard",
							rememberMe,
						},
						{
							onRequest: () => {
								setLoading(true);
							},
							onResponse: () => {
								setLoading(false);
							},
							onError: (ctx) => {
								toast.error(ctx.error.message);
							},
						}
					);
				}}
				type="submit"
			>
				{loading ? <Loader2 className="animate-spin" size={16} /> : "Login"}
			</Button>
			<Button
				className=" gap-2"
				onClick={async () => {
					await signIn.social({
						provider: "google",
						callbackURL: "/dashboard",
					});
				}}
				variant="outline"
			>
				<svg
					height="1em"
					viewBox="0 0 256 262"
					width="0.98em"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
						fill="#4285F4"
					/>
					<path
						d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
						fill="#34A853"
					/>
					<path
						d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
						fill="#FBBC05"
					/>
					<path
						d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
						fill="#EB4335"
					/>
				</svg>
				<p>Continue With Google</p>
			</Button>
			<Button
				className="gap-2"
				onClick={async () => {
					await signIn.passkey({
						fetchOptions: {
							onSuccess(context) {
								router.push("/dashboard");
							},
							onError(context) {
								toast.error(context.error.message);
							},
						},
					});
				}}
				variant="outline"
			>
				<Key size={16} />
				Sign-in with Passkey
			</Button>
		</div>
	);
}
