<script>
	import ForgotForm from './form.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="flex h-screen items-center justify-center">
	<div class="hidden h-full overflow-hidden lg:block lg:w-3/5">
		<img src={data.url} alt="forgot logo" class="h-full object-cover" />
	</div>
	<div class="flex w-full items-center justify-center rounded-xl bg-white p-8 shadow sm:max-w-md lg:w-2/5 lg:max-w-full lg:rounded-none lg:p-14 lg:shadow-none">
		<div class="w-full max-w-md space-y-8">
			<div class="text-center">
				<h2 class="mt-6 text-3xl font-bold text-gray-900">找回密码</h2>
			</div>

			<ForgotForm {data} />
		</div>
	</div>
</div>
