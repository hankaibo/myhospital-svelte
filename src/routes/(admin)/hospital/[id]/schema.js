import { z } from 'zod';

export const formSchema = z.object({
	id: z.string(),
	name: z.string().min(1, { message: '医院名称至少需要1个字符' }),
	code: z.string().min(1, { message: '医院编码至少需要1个字符' }),
	district: z.string().optional(),
	type: z.string().optional(),
	lvl: z.string().optional(),
	address: z.string().max(200, { message: '地址不能超过200个字符' }).optional(),
	zipCode: z.string().nullable().optional(),
	introduction: z.string().optional(),
	lng: z.string().optional(),
	lat: z.string().optional()
});

/**
 * @typedef {typeof formSchema} FormSchema
 */
