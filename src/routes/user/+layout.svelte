<script>
	import { goto } from '$app/navigation';

	async function handleLogout() {
		await fetch('/api/auth/logout', {
			method: 'post',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		});
		localStorage.clear();
		return goto('/login');
	}
</script>

<nav class="border-gray-200 bg-white dark:bg-gray-900">
	<div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
		<a href="#" class="flex items-center">
			<img src="" class="mr-3 h-8" alt="Flowbite Logo" />
			<span class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">Logo</span>
		</a>
		<div class="flex items-center md:order-2">
			<button
				type="button"
				class="mr-3 flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 md:mr-0 dark:focus:ring-gray-600"
				id="user-menu-button"
				aria-expanded="false"
				data-dropdown-toggle="user-dropdown"
				data-dropdown-placement="bottom"
			>
				<span class="sr-only">Open user menu</span>
				<img class="h-8 w-8 rounded-full" src="" alt="user photo" />
			</button>
			<!-- Dropdown menu -->
			<div class="z-50 my-4 hidden list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700" id="user-dropdown">
				<div class="px-4 py-3">
					<span class="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
					<span class="block truncate text-sm text-gray-500 dark:text-gray-400">name@flowbite.com</span>
				</div>
				<ul class="py-2" aria-labelledby="user-menu-button">
					<li>
						<a on:click={handleLogout} href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">退出</a>
					</li>
				</ul>
			</div>
			<button
				data-collapse-toggle="navbar-user"
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				aria-controls="navbar-user"
				aria-expanded="false"
			>
				<span class="sr-only">Open main menu</span>
				<svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
				</svg>
			</button>
		</div>
		<div class="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto" id="navbar-user">
			<ul
				class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900"
			>
				<li>
					<a href="#" class="block rounded bg-blue-700 py-2 pl-3 pr-4 text-white md:bg-transparent md:p-0 md:text-blue-700 md:dark:text-blue-500" aria-current="page">Home</a>
				</li>

				<li>
					<a
						href="#"
						class="block rounded py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
						>User</a
					>
				</li>
			</ul>
		</div>
	</div>
</nav>

<main class="mx-auto max-w-screen-xl">
	<slot />
</main>
