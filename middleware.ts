import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "./stack";

export async function middleware(request: NextRequest) {
	if (process.env.NODE_ENV === "development") {
		return NextResponse.next();
	}

	const user = await stackServerApp.getUser();
	if (!user) {
		return NextResponse.redirect(new URL("/handler/sign-in", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 * - handler (auth routes)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|handler).*)",
	],
};
