import {
	SignInButton,
	SignInFallback,
} from "@/features/auth/components/sign-in-btn";
import { Suspense } from "react";

export default async function Home() {
	return (
		<div className="min-h-[80vh] flex items-center justify-center overflow-hidden no-visible-scrollbar px-6 md:px-0">
			<main className="flex flex-col gap-4 row-start-2 items-center justify-center">
				<div className="md:w-10/12 w-full flex flex-col gap-4">
					<Suspense fallback={<SignInFallback />}>
						<SignInButton />
					</Suspense>
				</div>
			</main>
		</div>
	);
}
