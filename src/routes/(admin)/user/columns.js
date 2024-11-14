import { createRawSnippet } from 'svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import DataTableAvatar from './data-table-avatar.svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableEmailButton from './data-table-email-button.svelte';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';

// /** @type {{column?: Array<import('./types').User>}} */
export const columns = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsAllPageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				controlledChecked: true,
				'aria-label': '全选'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
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
			return renderComponent(DataTableAvatar, { src: row.original.phone?.path });
		}
	},
	{
		accessorKey: 'name',
		header: '姓名',
		cell: ({ row }) => {
			const nameCellSnippet = createRawSnippet((user) => {
				const name = user.lastName + user.firstName;
				return {
					render: () => `${name}`
				};
			});

			return renderSnippet(nameCellSnippet, {
				lastName: row.original.lastName,
				firstName: row.original.firstName
			});
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
			console.log(row);
		}
	},
	{
		id: '操作',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}
];
