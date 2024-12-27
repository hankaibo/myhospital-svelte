<script>
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './password-schema';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	const form = superForm(data.passwordForm, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form use:enhance method="post" class="space-y-6" action="?/save">
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ attrs })}
				<Form.Label>密码</Form.Label>
				<Input {...attrs} type="password" bind:value={$formData.password} required />
				<Form.FieldErrors />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="newPassword">
		<Form.Control>
			{#snippet children({ attrs })}
				<Form.Label>新密码</Form.Label>
				<Input {...attrs} type="password" bind:value={$formData.newPassword} required />
				<Form.FieldErrors />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="confirmPassword">
		<Form.Control>
			{#snippet children({ attrs })}
				<Form.Label>确认密码</Form.Label>
				<Input {...attrs} type="password" bind:value={$formData.confirmPassword} required />
				<Form.FieldErrors />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Button type="submit" color="purpleToBlue" class="">更新密码</Form.Button>
</form>
