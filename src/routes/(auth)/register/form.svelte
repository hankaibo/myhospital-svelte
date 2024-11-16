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
	<div class="grid grid-cols-2 gap-6">
		<Form.Field {form} name="firstName" class="space-y-2">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-sm">名</Form.Label>
					<Input {...props} type="text" bind:value={$formData.firstName} required />
					<Form.FieldErrors class="h-5" errorClasses="animate-bounce"/>
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="lastName" class="space-y-2">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label class="text-sm">姓</Form.Label>
					<Input {...props} type="text" bind:value={$formData.lastName} required />
					<Form.FieldErrors class="h-5" errorClasses="animate-bounce"/>
				{/snippet}
			</Form.Control>
		</Form.Field>
	</div>

	<Form.Field {form} name="email" class="space-y-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm">邮箱</Form.Label>
				<Input {...props} type="email" bind:value={$formData.email} required />
				<Form.FieldErrors class="h-5" errorClasses="animate-bounce"/>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="password" class="space-y-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm">密码</Form.Label>
				<Input {...props} type="password" bind:value={$formData.password} required />
				<Form.FieldErrors class="h-5" errorClasses="animate-bounce"/>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="confirmPassword" class="space-y-2">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="text-sm">确认密码</Form.Label>
				<Input {...props} type="password" bind:value={$formData.confirmPassword} required />
				<Form.FieldErrors class="h-5" errorClasses="animate-bounce"/>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Button type="submit" color="purpleToBlue" class="w-full">注册</Form.Button>

	<div class="flex items-center justify-end">
		<a href="/forgot" class="text-sm font-medium hover:underline">忘记密码</a>
	</div>

	<p class="text-md text-center">
		<span>已有账号？</span>
		<a href="/login" class="font-medium hover:underline">登录</a>
	</p>
</form>
