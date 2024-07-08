<script>
	import { Button } from '$lib/components/ui/button';
	import FacebookSolid from '$lib/components/svg/brand-facebook.svelte';
	import TwitterSolid from '$lib/components/svg/brand-x.svelte';
	import GoogleSolid from '$lib/components/svg/brand-google.svelte';
	import AppleSolid from '$lib/components/svg/brand-apple.svelte';
	import LoginForm from './form.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>登录</title>
</svelte:head>

<div class="flex h-screen items-center justify-center">
	<div class="hidden h-full overflow-hidden lg:block lg:w-3/5">
		<img src={data.url} alt="Bing 每日背景图片" class="h-full object-cover" />
	</div>
	<div class="flex w-full items-center justify-center rounded-xl bg-white p-6 shadow sm:max-w-md lg:w-2/5 lg:max-w-full lg:rounded-none lg:p-14 lg:shadow-none">
		<div class="w-full max-w-md space-y-8">
			<div class="text-center">
				<h2 class="mt-6 text-3xl font-bold text-gray-900">欢迎回来！</h2>
			</div>

			<div class="flex flex-row items-center justify-center space-x-3">
				<Button class="bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-[#3b5998]/50 dark:focus:ring-[#3b5998]/55">
					<FacebookSolid />
				</Button>
				<Button class="bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-[#1da1f2]/50 dark:focus:ring-[#1da1f2]/55">
					<TwitterSolid />
				</Button>
				<Button class="bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-[#4285F4]/50 dark:focus:ring-[#4285F4]/55">
					<GoogleSolid />
				</Button>
				<Button class="bg-[#050708] hover:bg-[#050708]/90 focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-[#050708]/50">
					<AppleSolid />
				</Button>
			</div>

			<div class="relative inline-flex w-full items-center justify-center">
				<hr class="my-8 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
				<span class="absolute left-1/2 -translate-x-1/2 bg-white px-3 font-normal text-gray-300 dark:bg-gray-900 dark:text-white">or</span>
			</div>

			<LoginForm {data} />
		</div>
	</div>
</div>
