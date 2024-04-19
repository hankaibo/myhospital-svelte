<script>
	import { enhance } from '$app/forms';
	import { Label, Helper, Input, Button, GradientButton, Checkbox, A, Hr, Img } from 'flowbite-svelte';
	import { FacebookSolid, TwitterSolid, GoogleSolid, AppleSolid } from 'flowbite-svelte-icons';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<svelte:head>
	<title>登录</title>
</svelte:head>

<div class="flex h-screen items-center justify-center">
	<div class="hidden h-full overflow-hidden lg:block lg:w-3/5">
		<Img bind:src={data.url} alt="forgot logo" class="h-full object-cover" />
	</div>
	<div class="flex w-full items-center justify-center rounded-xl bg-white p-6 shadow sm:max-w-md lg:w-2/5 lg:max-w-full lg:rounded-none lg:p-14 lg:shadow-none">
		<div class="w-full max-w-md space-y-8">
			<div class="text-center">
				<h2 class="mt-6 text-3xl font-bold text-gray-900">欢迎回来！</h2>
			</div>
			<div class="flex flex-row items-center justify-center space-x-3">
				<Button class="bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-[#3b5998]/50 dark:focus:ring-[#3b5998]/55">
					<FacebookSolid size="sm" />
				</Button>
				<Button class="bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-[#1da1f2]/50 dark:focus:ring-[#1da1f2]/55">
					<TwitterSolid size="sm" />
				</Button>
				<Button class="bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-[#4285F4]/50 dark:focus:ring-[#4285F4]/55">
					<GoogleSolid size="sm" />
				</Button>
				<Button class="bg-[#050708] hover:bg-[#050708]/90 focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-[#050708]/50">
					<AppleSolid size="sm" />
				</Button>
			</div>
			<div>
				<Hr classHr="my-8 w-full"><span class="font-normal text-gray-300">or continue with</span></Hr>
			</div>

			<form use:enhance method="post" class="space-y-6">
				<div>
					<Label for="email" class="mb-2">Email address</Label>
					<Input name="email" type="email" id="email" required />
					{#if form?.errors?.email}
						<Helper class="mt-2" color="red">{form.errors.email}</Helper>
					{/if}
				</div>
				<div>
					<Label for="password" class="mb-2">Password</Label>
					<Input name="password" type="password" id="password" placeholder="•••••••••" required />
					{#if form?.errors?.password}
						<Helper class="mt-2" color="red">{form.errors.password}</Helper>
					{/if}
				</div>

				<div>
					<GradientButton type="submit" color="purpleToBlue" class="w-full">登录</GradientButton>
				</div>

				<div class="flex items-center justify-between">
					<Checkbox>记住我</Checkbox>
					<A href="/forgot" class="text-sm font-medium hover:underline">忘记密码</A>
				</div>

				<p class="text-md text-center">
					<span class="text-gray-500">没有账号？</span>
					<A href="/register" class="font-medium hover:underline">注册</A>
				</p>
			</form>
		</div>
	</div>
</div>
