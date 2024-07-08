<script>
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import SuperDebug from 'sveltekit-superforms';

	/** @type {import('./$types').PageData} */
	export let data;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;
</script>

<form use:enhance method="post">
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>邮箱</Form.Label>
			<Input {...attrs} type="email" bind:value={$formData.email} />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>密码</Form.Label>
			<Input {...attrs} type="password" bind:value={$formData.password} />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<Form.Button class="w-full">Submit</Form.Button>

	<div class="flex items-center justify-between">
		<Checkbox>记住我</Checkbox>
		<a href="/forgot" class="text-sm font-medium hover:underline">忘记密码</a>
	</div>

	<p class="text-md text-center">
		<span class="text-gray-500">没有账号？</span>
		<a href="/register" class="font-medium hover:underline">注册</a>
	</p>
</form>
<SuperDebug data={$formData} />
