import { z } from 'zod';

export const formSchema = z
	.object({
		password: z.string().min(6, { message: '密码至少需要6个字符' }),
		newPassword: z.string().min(6, { message: '密码至少需要6个字符' }),
		confirmPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'] // This will highlight the confirmPassword field in case of an error
	});
