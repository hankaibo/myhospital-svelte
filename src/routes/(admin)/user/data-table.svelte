<script>
	import { run } from 'svelte/legacy';

	import { readable } from 'svelte/store';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import DataTableAvator from './data-table-avatar.svelte';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { cn } from '$lib/utils.js';

	/** @type {{userList?: Array<import('./types').User>}} */
	let { userList = [] } = $props();

	const table = createTable(readable(userList), {
		page: addPagination(),
		sort: addSortBy({ disableMultiSort: true }),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'photo',
			header: '头像',
			cell: (dataCell, status) => {
				return createRender(DataTableAvator, { src: dataCell.value });
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'name',
			header: '姓名',
			cell: ({ row }) => {
				const { original } = row;
				const { firstName, lastName } = original;
				return lastName + firstName;
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'email',
			header: 'Email'
		}),
		table.column({
			accessor: 'status',
			header: '状态',
			cell: ({ value }) => {
				return createRender(Switch, {
					checked: value.name === 'Active',
					id: value.id,
					/**
					 * 处理 Switch 组件的状态改变事件
					 * @param {boolean} checked - 表示 Switch 组件的当前状态，true 表示开启，false 表示关闭
					 */
					onCheckedChange: (checked) => {
						// 在这里处理 change 事件
						console.log('Switch 状态改变:', checked, value.id);
					}
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '操作',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: String(value) });
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { sortKeys } = pluginStates.sort;
	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;
	const { selectedDataIds } = pluginStates.select;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = $state(Object.fromEntries(ids.map((id) => [id, true])));

	run(() => {
		$hiddenColumnIds = Object.entries(hideForId)
			.filter(([_, hide]) => !hide)
			.map(([id]) => id);
	});

	const hideableCols = ['name', 'email', 'status'];
</script>

<div class="w-full">
	<div class="flex items-center py-4">
		<Input class="max-w-sm" placeholder="Filter emails..." type="text" bind:value={$filterValue} />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				{#snippet children({ builder })}
					<Button variant="outline" class="ml-auto" builders={[builder]}>
						列 <ChevronDown class="ml-2 h-4 w-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#each flatColumns as col}
					{#if hideableCols.includes(col.id)}
						<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
							{col.header}
						</DropdownMenu.CheckboxItem>
					{/if}
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} props={cell.props()}>
									{#snippet children({ attrs, props })}
										<Table.Head {...attrs} class={cn('[&:has([role=checkbox])]:pl-3')}>
											{#if cell.id === 'amount'}
												<div class="text-right">
													<Render of={cell.render()} />
												</div>
											{:else if cell.id === 'email'}
												<Button variant="ghost" on:click={props.sort.toggle}>
													<Render of={cell.render()} />
													<ArrowUpDown
														class={cn(
															$sortKeys[0]?.id === cell.id && 'text-foreground',
															'ml-2 h-4 w-4'
														)}
													/>
												</Button>
											{:else}
												<Render of={cell.render()} />
											{/if}
										</Table.Head>
									{/snippet}
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()}>
						{#snippet children({ rowAttrs })}
							<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()}>
										{#snippet children({ attrs })}
											<Table.Cell {...attrs} class="[&:has([role=checkbox])]:pl-3">
												{#if cell.id === 'amount'}
													<div class="text-right font-medium">
														<Render of={cell.render()} />
													</div>
												{:else if cell.id === 'status'}
													<div class="capitalize">
														<Render of={cell.render()} />
													</div>
												{:else}
													<Render of={cell.render()} />
												{/if}
											</Table.Cell>
										{/snippet}
									</Subscribe>
								{/each}
							</Table.Row>
						{/snippet}
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{Object.keys($selectedDataIds).length} of{' '}
			{$rows.length} 行被选中。
		</div>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>上一页</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>下一页</Button
		>
	</div>
</div>
