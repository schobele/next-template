import { z } from "zod";

export type ActionErrorResponse = {
	success: false;
	data: undefined;
	error: string;
	code?: string;
	details?: Record<string, unknown>;
};

export type ActionResponse<T = void> =
	| {
			success: true;
			data: T;
			error: null;
	  }
	| ActionErrorResponse;

export const actionSuccess = <T>(data: T): ActionResponse<T> => ({
	success: true,
	data,
	error: null,
});

export const actionError = (
	error: string,
	code?: string,
	details?: Record<string, unknown>
): ActionResponse<never> => ({
	success: false,
	data: undefined,
	error,
	code,
	details,
});

// Wrapper for handling errors in server actions
export async function safeAction<T>(
	fn: () => Promise<T>
): Promise<ActionResponse<T>> {
	try {
		const data = await fn();
		return actionSuccess(data);
	} catch (error) {
		console.error("Action error:", error);
		return actionError(
			error instanceof Error ? error.message : "An unexpected error occurred"
		);
	}
}

// Your existing schema function
export const actionResponseSchema = <T>(schema: z.ZodSchema<T>) =>
	z.discriminatedUnion("success", [
		z.object({
			success: z.literal(true),
			data: schema,
			error: z.literal(null),
		}),
		z.object({
			success: z.literal(false),
			data: z.undefined(),
			error: z.string(),
		}),
	]);

// Optional: Schema with validation error details
export const detailedActionResponseSchema = <T>(schema: z.ZodSchema<T>) =>
	z.discriminatedUnion("success", [
		z.object({
			success: z.literal(true),
			data: schema,
			error: z.literal(null),
		}),
		z.object({
			success: z.literal(false),
			data: z.undefined(),
			error: z.string(),
			code: z.string().optional(),
			details: z.record(z.string(), z.unknown()).optional(),
		}),
	]);
