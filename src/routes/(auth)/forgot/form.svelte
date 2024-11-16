<script>
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	/**
	 * @type {import('sveltekit-superforms').SuperValidated<import('sveltekit-superforms').Infer<import('./schema').FormSchema>>} data
	 */
	let { data } = $props();

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form use:enhance method="post" class="space-y-2">
	<Form.Field {form} name="email" class="space-y-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm">邮箱</Form.Label>
				<Input {...props} type="email" bind:value={$formData.email} required />
				<Form.FieldErrors class="h-5" errorClasses="animate-bounce" />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Button type="submit" color="purpleToBlue" class="w-full">发送</Form.Button>

	<div class="flex items-center justify-end">
		<a href="/register" class="text-sm font-medium hover:underline">注册</a>
	</div>

	<p class="text-md text-center">
		<span>已有账号？</span>
		<a href="/login" class="font-medium hover:underline">登录</a>
	</p>
</form>
