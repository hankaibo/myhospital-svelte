<script>
	import { base } from '$app/paths';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	/** @type {string} */
	export let id;

	function handleEdit() {
		// 跳转到用户详情页面
		goto(`${base}/user/${id}`);
	}

	function handleDelete() {
		console.log('Delete');
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item on:click={handleEdit}>编辑</DropdownMenu.Item>
		<DropdownMenu.Item on:click={handleDelete}>删除</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
