import { z } from 'zod';

export const formSchema = z
	.object({
		firstName: z.string().min(2, { message: '名字至少需要2个字符' }),
		lastName: z.string().min(2, { message: '名字至少需要2个字符' }),
		email: z.string().email({ message: '请输入正确的邮箱地址' }),
		password: z.string().min(6, { message: '密码至少需要6个字符' }),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'] // This will highlight the confirmPassword field in case of an error
	});

/**
 * @typedef {typeof formSchema} FormSchema
 */
