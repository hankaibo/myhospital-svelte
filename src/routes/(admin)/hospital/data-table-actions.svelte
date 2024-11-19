<script>
	import { MapPin, Pencil, Trash2, Ellipsis } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import LocationMap from './location-map.svelte';

	/** @type {{id: string, lng?:number, lat?:number}} */
	let { id, lng, lat } = $props();
	/** @type {boolean} */
	let dialogOpen = $state(false);

	function handleCopy() {
		// 跳转到用户详情页面
		goto(`/hospital/${id}`);
	}

	function handleEdit() {
		goto(`/hospital/${id}`);
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
	<DropdownMenu.Content class="">
		<DropdownMenu.Item class="" inset onclick={handleCopy}>影分身</DropdownMenu.Item>
		<DropdownMenu.Item class="" inset>
			<Button
				variant="ghost"
				size="icon"
				class="relative size-8 p-0"
				onclick={() => (dialogOpen = true)}
			>
				<MapPin class="size-4" />
				地理编码
			</Button>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="" inset>
			<Button variant="ghost" size="icon" class="relative size-8 p-0" onclick={handleEdit}>
				<Pencil class="size-4" />
				编辑
			</Button>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="" inset>
			<Button variant="ghost" size="icon" class="relative size-8 p-0">
				<Trash2 class="size-4" />
				删除
			</Button>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<LocationMap {id} {dialogOpen} {lng} {lat} />
