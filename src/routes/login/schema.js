import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email({ message: '请输入正确的邮箱地址' }),
	password: z.string().min(8, { message: '密码至少需要8个字符' })
});
