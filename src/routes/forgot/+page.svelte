<script>
	import { enhance } from '$app/forms';
	import { Label, Input, GradientButton, A, Img, Span } from 'flowbite-svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="flex h-screen items-center justify-center">
	<div class="hidden h-full overflow-hidden lg:block lg:w-3/5">
		<Img bind:src={data.url} alt="forgot logo" class="h-full object-cover" />
	</div>
	<div class="flex w-full items-center justify-center rounded-xl bg-white p-8 shadow sm:max-w-md lg:w-2/5 lg:max-w-full lg:rounded-none lg:p-14 lg:shadow-none">
		<div class="w-full max-w-md space-y-8">
			<div class="text-center">
				<h2 class="mt-6 text-3xl font-bold text-gray-900">找回密码</h2>
			</div>

			<form use:enhance method="post" class="space-y-8">
				<div>
					<Label for="email" class="mb-2">Email address</Label>
					<Input name="email" type="email" id="email" required />
				</div>

				<div>
					<GradientButton type="submit" color="purpleToBlue" class="w-full">发送</GradientButton>
				</div>

				<div class="flex items-center justify-end">
					<A href="/register" class="text-sm font-medium hover:underline">注册</A>
				</div>

				<p class="text-md text-center">
					<Span class="text-gray-500">已有账号？</Span>
					<A href="/login" class="font-medium hover:underline">登录</A>
				</p>
			</form>
		</div>
	</div>
</div>
