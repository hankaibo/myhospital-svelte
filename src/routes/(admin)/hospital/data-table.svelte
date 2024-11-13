<script>
	import { run } from 'svelte/legacy';

	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import { writable } from 'svelte/store';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Pagination from '$lib/components/ui/pagination';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { cn } from '$lib/utils.js';
	import { mediaQuery } from 'svelte-legos';

	const isDesktop = mediaQuery('(min-width: 768px)');

	let siblingCount = $derived($isDesktop ? 1 : 0);

	/** @type {{hospitalList?: Array<import('./types').Hospital>, total?: number}} */
	let { hospitalList = [], total = 0 } = $props();

	let hospitalListStore = writable(hospitalList);
	run(() => {
		hospitalListStore.set(hospitalList);
	});

	const table = createTable(hospitalListStore, {
		sort: addSortBy({ disableMultiSort: true }),
		page: addPagination({
			serverSide: true,
			serverItemCount: writable(total)
		}),
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
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'code',
			header: 'Code',
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
			accessor: 'district',
			header: 'District',
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
			accessor: 'address',
			header: 'Address',
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
			accessor: 'zipCode',
			header: 'Zip Code',
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
			accessor: 'introduction',
			header: 'Introduction',
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
			accessor: 'lng',
			header: '经度',
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
			accessor: 'lat',
			header: '纬度',
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
				return createRender(DataTableActions, { id: value });
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
	const { pageIndex } = pluginStates.page;
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

	const hideableCols = [
		'name',
		'code',
		'district',
		'address',
		'zipCode',
		'introduction',
		'lng',
		'lat'
	];

	/** @type {Function|undefined} unsubscribe */
	let unsubscribe;
	onMount(() => {
		unsubscribe = pageIndex.subscribe((val) => {
			goto(`?page=${val + 1}`);
		});
	});
	// 清理订阅
	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<div class="w-full">
	<div class="flex items-center py-4">
		<Input class="max-w-sm" placeholder="Search" type="text" bind:value={$filterValue} />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				{#snippet children({ builder })}
					<Button variant="outline" class="ml-auto" builders={[builder]}>
						Columns <ChevronDown class="ml-2 h-4 w-4" />
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
											{#if cell.id === 'lngLat'}
												<div class="text-right">
													<Render of={cell.render()} />
												</div>
											{:else if cell.id === 'name'}
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
											<Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
												{#if cell.id === 'lng' || cell.id === 'lat'}
													<div class="text-right">
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
			{$rows.length} 条中的 {Object.keys($selectedDataIds).length} 条被选中。
		</div>

		<div>
			<Pagination.Root count={total} {siblingCount}>
				{#snippet children({ pages })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton on:click={() => ($pageIndex = $pageIndex - 1)} />
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item isVisible={$pageIndex + 1 == page.value}>
									<Pagination.Link
										{page}
										isActive={$pageIndex + 1 == page.value}
										on:click={() => ($pageIndex = page.value - 1)}
									></Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton on:click={() => ($pageIndex = $pageIndex + 1)} />
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</div>
	</div>
</div>
