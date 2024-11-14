<script>
	import { base } from '$app/paths';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	/** @type {{id: string}} */
	let { id } = $props();

	function handleEdit() {
		// 跳转到用户详情页面
		goto(`${base}/user/${id}`);
	}

	function handleDelete() {
		console.log('Delete');
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>操作</DropdownMenu.GroupHeading>
			<DropdownMenu.Item onclick={handleEdit}>编辑</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleDelete}>删除</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
