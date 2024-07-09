import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email({ message: '请输入正确的邮箱地址' })
});
