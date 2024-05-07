<script>
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';

	$: activeUrl = $page.url.pathname;

	console.log({}.toString.call($page?.data?.user?.phone));
</script>

<Navbar class="border-b border-gray-200">
	<NavBrand href="/">
		<slot name="brand" />
	</NavBrand>
	<NavUl {activeUrl}>
		<NavLi href="/">Home</NavLi>
		{#if $page.data.user?.role?.name === 'Admin'}
			<NavLi href="/user">User</NavLi>
		{/if}
		<NavLi href="/about">About</NavLi>
	</NavUl>
	<div class="flex items-center">
		{#if $page.data.user}
			<Avatar class="cursor-pointer" id="avatar-menu" bind:src={$page.data.user.photo} />
		{:else}
			<Avatar class="cursor-pointer" id="avatar-menu" />
		{/if}
		<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			{#if $page.data.user}
				<DropdownHeader>
					<span class="block text-sm">{$page.data.user.lastName + $page.data.user.firstName}</span>
					<span class="block truncate text-sm font-medium">{$page.data.user.email}</span>
				</DropdownHeader>
				<DropdownItem href="/settings">设置</DropdownItem>
				<DropdownDivider />
				<DropdownItem>
					<slot name="logout" />
				</DropdownItem>
			{:else}
				<DropdownItem href="/login">登录</DropdownItem>
			{/if}
		</Dropdown>
	</div>
</Navbar>
