
/**
 * Represents a user with various properties.
 */
export interface User {
	id: number | string;
	email: string | null;
	provider: string;
	socialId?: string | null;
	firstName: string | null;
	lastName: string | null;
	photo?: FileType | null;
	role?: Role | null;
	status?: Status;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}

export interface FileType {
	id: string;
	path: string;
}

export interface Role {
	id: number | string;
	name?: string;
}
