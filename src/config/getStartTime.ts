import { STATIC_USERS } from "../config/staticUser";

export function getStartTime(address: string): string | null {
	const user = STATIC_USERS[address.toLowerCase()];
	return user?.startTime ?? null;
}
