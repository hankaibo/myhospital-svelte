<script>
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import SettingsForm from './form.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let value = [];
	/** @type FileList | undefined  */
	$: files = undefined;

	const dropHandle = (event) => {
		value = [];
		event.preventDefault();
		if (event.dataTransfer.items) {
			[...event.dataTransfer.items].forEach((item, i) => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					value.push(file.name);
					value = value;
				}
			});
		} else {
			[...event.dataTransfer.files].forEach((file, i) => {
				value = file.name;
			});
		}
	};

	const handleChange = async (event) => {
		files = event.target.files;
		if (files.length > 0) {
			value.push(files[0].name);
			value = value;
		}

		const form = document.querySelector('#formUpload');
		await tick();
		form.submit();
	};

	const showFiles = (files) => {
		if (files.length === 1) return files[0];
		let concat = '';
		files.map((file) => {
			concat += file;
			concat += ',';
			concat += ' ';
		});

		if (concat.length > 40) concat = concat.slice(0, 40);
		concat += '...';
		return concat;
	};
</script>

<svelte:head>
	<title>设置</title>
</svelte:head>

<div class="m-auto w-[800px] space-y-8">
	<div class="text-center">
		<h2 class="mt-6 text-3xl font-bold text-gray-900">个人信息</h2>
	</div>

	<div class="grid grid-cols-2 gap-6">
		<div class="mb-6">
			{#if $page.data.user.photo}
				<Label for="email" class="mb-2">头像</Label>
				<Avatar class="h-full w-full" />
			{:else}
				<form id="formUpload" method="post" action="?/upload">
					<Dropzone
						id="dropzone"
						:files={files}
						on:drop={dropHandle}
						on:dragover={(event) => {
							event.preventDefault();
						}}
						on:change={handleChange}
					>
						<svg aria-hidden="true" class="mb-3 h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
							><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg
						>
						{#if value.length === 0}
							<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="font-semibold">Click to upload</span> or drag and drop
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
						{:else}
							<p>{showFiles(value)}</p>
						{/if}
					</Dropzone>
				</form>
			{/if}
		</div>

		<div>
			<SettingsForm {data} />
		</div>
	</div>
</div>
