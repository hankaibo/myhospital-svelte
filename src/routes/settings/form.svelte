<script>
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

<form use:enhance method="post" class="space-y-6" action="?/save">
	<div class="grid grid-cols-2 gap-6">
		<Form.Field {form} name="firstName">
			<Form.Control let:attrs>
				<Form.Label>名</Form.Label>
				<Input {...attrs} type="text" bind:value={$formData.firstName} required />
				<Form.FieldErrors />
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="lastName">
			<Form.Control let:attrs>
				<Form.Label>姓</Form.Label>
				<Input {...attrs} type="text" bind:value={$formData.lastName} required />
				<Form.FieldErrors />
			</Form.Control>
		</Form.Field>
	</div>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>密码</Form.Label>
			<Input {...attrs} type="password" bind:value={$formData.password} required />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="confirmPassword">
		<Form.Control let:attrs>
			<Form.Label>新密码</Form.Label>
			<Input {...attrs} type="password" bind:value={$formData.confirmPassword} required />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<Form.Button type="submit" color="purpleToBlue" class="w-full">更新</Form.Button>
</form>
