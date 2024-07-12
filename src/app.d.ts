// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: User; // 根据实际情况设置类型
			token?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	photo: string;
	role: string;
}

export { };
