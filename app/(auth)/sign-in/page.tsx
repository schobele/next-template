"use client";

import SignIn from "@/features/auth/components/sign-in";
import { SignUp } from "@/features/auth/components/sign-up";
import MagicLinkSignIn from "@/features/auth/components/magic-link-sign-in";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { client } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
	const router = useRouter();
	useEffect(() => {
		client.oneTap({
			fetchOptions: {
				onError: ({ error }) => {
					toast.error(error.message || "An error occurred");
				},
				onSuccess: () => {
					toast.success("Successfully signed in");
					router.push("/dashboard");
				},
			},
		});
	}, []);

	return (
		<div className="w-full">
			<div className="flex items-center flex-col justify-center w-full md:py-10">
				<div className="md:w-[400px]">
					<Tabs defaultValue="sign-in">
						<TabsList>
							<TabsTrigger value="sign-in">Sign In</TabsTrigger>
							<TabsTrigger value="sign-up">Sign Up</TabsTrigger>
							<TabsTrigger value="magic-link">Magic Link</TabsTrigger>
						</TabsList>
						<TabsContent value="sign-in">
							<SignIn />
						</TabsContent>
						<TabsContent value="sign-up">
							<SignUp />
						</TabsContent>
						<TabsContent value="magic-link">
							<MagicLinkSignIn />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
