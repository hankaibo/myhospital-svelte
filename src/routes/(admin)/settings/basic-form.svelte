<script>
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './basic-schema';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	const form = superForm(data.basicForm, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form use:enhance method="post" class="space-y-6" action="?/save">
	<div class="grid grid-cols-2 gap-6">
		<Form.Field {form} name="firstName">
			<Form.Control>
				{#snippet children({ attrs })}
					<Form.Label>名</Form.Label>
					<Input {...attrs} type="text" bind:value={$formData.firstName} required />
					<Form.FieldErrors />
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="lastName">
			<Form.Control>
				{#snippet children({ attrs })}
					<Form.Label>姓</Form.Label>
					<Input {...attrs} type="text" bind:value={$formData.lastName} required />
					<Form.FieldErrors />
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ attrs })}
					<Form.Label>邮箱</Form.Label>
					<Input {...attrs} type="text" bind:value={$formData.email} required />
					<Form.FieldErrors />
				{/snippet}
			</Form.Control>
		</Form.Field>
	</div>

	<Form.Button type="submit" color="purpleToBlue" class="w-full">更新</Form.Button>
</form>
