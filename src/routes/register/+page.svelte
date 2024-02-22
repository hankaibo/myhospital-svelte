<script>
	import { enhance } from '$app/forms';
	import { Label, Input, GradientButton, A, Img } from 'flowbite-svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>注册</title>
</svelte:head>

<div class="flex h-screen items-center justify-center">
	<div class="hidden h-full overflow-hidden lg:block lg:w-3/5">
		<Img bind:src={data.url} alt="forgot logo" class="h-full object-cover" />
	</div>
	<div class="flex h-full w-full items-center justify-center rounded-xl bg-white p-8 sm:max-w-md lg:w-2/5 lg:max-w-full lg:rounded-none lg:p-14 lg:shadow-none">
		<div class="w-full max-w-md space-y-8">
			<div class="text-center">
				<h2 class="mt-6 text-3xl font-bold text-gray-900">注册账号</h2>
			</div>

			<form
				use:enhance={({ formData, cancel, submitter }) => {
					const password = formData.get('password');
					const confirmPassword = formData.get('confirmPassword');
					if (password !== confirmPassword) {
						cancel();
					}
					return async ({ result, update }) => {
						update();
					};
				}}
				method="post"
				class="space-y-8"
			>
				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<Label for="first_name" class="mb-2">First name</Label>
						<Input name="firstName" type="text" id="first_name" placeholder="John" required />
					</div>
					<div>
						<Label for="last_name" class="mb-2">Last name</Label>
						<Input name="lastName" type="text" id="last_name" placeholder="Doe" required />
					</div>
				</div>
				<div>
					<Label for="email" class="mb-2">Email address</Label>
					<Input name="email" type="email" id="email" required />
				</div>
				<div>
					<Label for="password" class="mb-2">Password</Label>
					<Input name="password" type="password" id="password" placeholder="•••••••••" required />
				</div>
				<div>
					<Label for="confirm_password" class="mb-2">Confirm password</Label>
					<Input name="confirmPassword" type="password" id="confirm_password" required />
				</div>
				<div>
					<GradientButton type="submit" color="purpleToBlue" class="w-full">注册</GradientButton>
				</div>

				<div class="flex items-center justify-end">
					<A href="/forgot" class="text-sm font-medium hover:underline">忘记密码</A>
				</div>

				<p class="text-md text-center text-gray-500">
					<span>已有账号？</span>
					<A href="/login" class="font-medium hover:underline">登录</A>
				</p>
			</form>
		</div>
	</div>
</div>
