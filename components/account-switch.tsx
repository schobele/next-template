"use client";

import { ChevronDown, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { client, useSession } from "@/lib/auth/client";
import type { Session } from "@/lib/auth/types";

export default function AccountSwitcher({ sessions }: { sessions: Session[] }) {
	const { data: currentUser } = useSession();
	const [open, setOpen] = useState(false);
	const router = useRouter();
	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger asChild>
				<Button
					aria-expanded={open}
					aria-label="Select a user"
					className="w-[250px] justify-between"
					role="combobox"
					variant="outline"
				>
					<Avatar className="mr-2 h-6 w-6">
						<AvatarImage
							alt={currentUser?.user.name}
							src={currentUser?.user.image || undefined}
						/>
						<AvatarFallback>{currentUser?.user.name.charAt(0)}</AvatarFallback>
					</Avatar>
					{currentUser?.user.name}
					<ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[250px] p-0">
				<Command>
					<CommandList>
						<CommandGroup heading="Current Account">
							<CommandItem
								className="w-full justify-between text-sm"
								key={currentUser?.user.id}
								onSelect={() => {}}
							>
								<div className="flex items-center">
									<Avatar className="mr-2 h-5 w-5">
										<AvatarImage
											alt={currentUser?.user.name}
											src={currentUser?.user.image || undefined}
										/>
										<AvatarFallback>
											{currentUser?.user.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									{currentUser?.user.name}
								</div>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Switch Account">
							{sessions
								.filter((s) => s.user.id !== currentUser?.user.id)
								.map((u, i) => (
									<CommandItem
										className="text-sm"
										key={i}
										onSelect={async () => {
											await client.multiSession.setActive({
												sessionToken: u.session.token,
											});
											setOpen(false);
										}}
									>
										<Avatar className="mr-2 h-5 w-5">
											<AvatarImage
												alt={u.user.name}
												src={u.user.image || undefined}
											/>
											<AvatarFallback>{u.user.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div className="flex w-full items-center justify-between">
											<div>
												<p>{u.user.name}</p>
												<p className="text-xs">({u.user.email})</p>
											</div>
										</div>
									</CommandItem>
								))}
						</CommandGroup>
					</CommandList>
					<CommandSeparator />
					<CommandList>
						<CommandGroup>
							<CommandItem
								className="cursor-pointer text-sm"
								onSelect={() => {
									router.push("/sign-in");
									setOpen(false);
								}}
							>
								<PlusCircle className="mr-2 h-5 w-5" />
								Add Account
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
