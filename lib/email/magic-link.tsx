import {
	Html,
	Head,
	Body,
	Container,
	Heading,
	Text,
	Link,
	Button,
	Hr,
	Preview,
	Tailwind,
} from "@react-email/components";

export const MagicLinkEmail = (props: {
	email: string;
	loginLink: string;
}) => {
	const previewText = `Sign in to your account`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white">
					<Container className="border border-solid border-[#eaeaea] rounded mx-auto max-w-[465px] p-[20px]">
						<Heading className="text-black text-[24px] font-normal text-center mx-0 my-[30px] p-0">
							Sign in to your account
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							Hey <strong>{props.email}</strong>,
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							Click the button below to sign in to your account. This link will expire in 10 minutes.
						</Text>
						<Button
							href={props.loginLink}
							className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 block w-full"
						>
							Sign in
						</Button>
						<Text className="text-black text-[14px] leading-[24px]">
							or copy and paste this URL into your browser:{" "}
							<Link href={props.loginLink} className="text-blue-600 no-underline">
								{props.loginLink}
							</Link>
						</Text>
						<Hr className="border border-solid border-[#eaeaea] mx-0 my-[26px] w-full" />
						<Text className="text-[#666666] text-[12px] leading-[24px]">
							If you didn't request this email, you can safely ignore it.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
export function reactMagicLinkEmail(props: {
	email: string;
	loginLink: string;
}) {
	console.log(props);
	return <MagicLinkEmail {...props} />;
}
