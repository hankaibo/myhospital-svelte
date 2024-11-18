import { z } from 'zod';

export const formSchema = z.object({
	id: z.number().int(),
	firstName: z.string().min(1, { message: '名字至少需要1个字符' }),
	lastName: z.string().min(1, { message: '名字至少需要1个字符' }),
	email: z.string().email({ message: '请输入正确的邮箱地址' })
});

/**
 * @typedef {typeof formSchema} FormSchema
 */
