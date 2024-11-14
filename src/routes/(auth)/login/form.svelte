<script>
	import { base } from '$app/paths';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';

	/**
	 * @typedef {Object} FormSchema
	 * @property {string} email - 用户名，至少3个字符
	 * @property {string} password - 密码，至少6个字符
	 */

	/**
	 * @template T
	 * @typedef {Object} SuperValidated
	 * @property {T} data - 验证后的数据
	 * @property {boolean} isValid - 表示验证是否通过
	 * @property {Object.<string, string>} errors - 错误信息，字段名为键，错误信息为值
	 */

	/**
	 * @typedef {FormSchema} Infer - 用于推断 `FormSchema` 类型的别名
	 */

	/**
	 * @type {SuperValidated<Infer>}
	 */
	let { data } = $props();

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form use:enhance method="post" class="w-full space-y-6">
	<Form.Field {form} name="email" class="">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>邮箱</Form.Label>
				<Input {...props} type="email" bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>密码</Form.Label>
				<Input {...props} type="password" bind:value={$formData.password} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="w-full">登录</Form.Button>

	<div class="flex items-center justify-between">
		<Checkbox>记住我</Checkbox>
		<a href="{base}/forgot" class="text-sm font-medium hover:underline">忘记密码</a>
	</div>

	<p class="text-md text-center">
		<span>没有账号？</span>
		<a href="{base}/register" class="font-medium hover:underline">注册</a>
	</p>
</form>
