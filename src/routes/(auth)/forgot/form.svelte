<script>
	import { base } from '$app/paths';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	/** @type {import('./$types').PageData}*/
	export let data;

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form use:enhance method="post" class="space-y-6">
	<Form.Field {form} name="email" class="mb-2">
		<Form.Control let:attrs>
			<Form.Label class="mb-2">邮箱</Form.Label>
			<Input {...attrs} type="email" bind:value={$formData.email} required />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<Form.Button type="submit" color="purpleToBlue" class="w-full">发送</Form.Button>

	<div class="flex items-center justify-end">
		<a href="{base}/register" class="text-sm font-medium hover:underline">注册</a>
	</div>

	<p class="text-md text-center">
		<span>已有账号？</span>
		<a href="{base}/login" class="font-medium hover:underline">登录</a>
	</p>
</form>
