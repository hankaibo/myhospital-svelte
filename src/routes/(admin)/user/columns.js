import { invalidate } from '$app/navigation';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableAvatar from './data-table-avatar.svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableEmailButton from './data-table-email-button.svelte';
import DataTableSwitch from './data-table-switch.svelte';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';

/** @type {import('@tanstack/table-core').ColumnDef<import('./types').User>[]} */
export const columns = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsAllPageRowsSelected() && !table.getIsAllPageRowsSelected(),
				/** @type {(value: boolean) => void} */
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				controlledChecked: true,
				'aria-label': '全选'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				/** @type {(value: boolean) => void} */
				onCheckedChange: (value) => row.toggleSelected(!!value),
				controlledChecked: true,
				'aria-label': '当前行'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'photo',
		header: '头像',
		cell: ({ row }) => {
			return renderComponent(DataTableAvatar, { src: row.original.photo?.path });
		}
	},
	{
		accessorKey: 'name',
		header: '姓名',
		cell: ({ row }) => {
			return `${row.original.lastName} ${row.original.firstName}`;
		}
	},
	{
		accessorKey: 'email',
		header: ({ column }) =>
			renderComponent(DataTableEmailButton, {
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc')
			})
	},
	{
		accessorKey: 'status',
		header: '状态',
		cell: ({ row }) => {
			return renderComponent(DataTableSwitch, {
				checked: row.original.status?.name === 'Active',
				/** @type {(value: boolean) => void} */
				onCheckedChange: (value) => {
					const id = row.original.id;

					fetch('/user', {
						method: 'PATCH',
						body: JSON.stringify({ id, status: value ? 'Active' : 'Inactive' }),
						headers: {
							'content-type': 'application/json'
						}
					}).then(() => {
						invalidate(window.location.pathname);
					});
				}
			});
		}
	},
	{
		id: '操作',
		header: '操作',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}
];
