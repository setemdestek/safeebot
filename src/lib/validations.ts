import { z } from 'zod'

export const chatMessageSchema = z.object({
  chatInput: z
    .string()
    .min(1, 'Mesaj boş ola bilməz')
    .max(2000, 'Mesaj 2000 simvoldan çox ola bilməz')
    .refine(
      (val) => !/<[^>]*>/.test(val),
      { message: 'HTML tag-larına icazə verilmir' }
    )
    .refine(
      (val) => !/javascript:/i.test(val),
      { message: 'JavaScript protokollarına icazə verilmir' }
    )
    .refine(
      (val) => !/on\w+\s*=/i.test(val),
      { message: 'Event handler-larına icazə verilmir' }
    ),
  sessionId: z
    .string()
    .min(1, 'Yanlış session ID formatı'),
})

export type ChatMessageInput = z.infer<typeof chatMessageSchema>

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Ad daxil edin')
    .max(50, 'Ad çox uzundur'),
  lastName: z
    .string()
    .min(1, 'Soyad daxil edin')
    .max(50, 'Soyad çox uzundur'),
  email: z
    .string()
    .email('Düzgün email ünvanı daxil edin'),
  password: z
    .string()
    .min(10, 'Parol ən az 10 simvol olmalıdır')
    .regex(/[A-Z]/, 'Ən az 1 böyük hərf olmalıdır')
    .regex(/[a-z]/, 'Ən az 1 kiçik hərf olmalıdır')
    .regex(/[0-9]/, 'Ən az 1 rəqəm olmalıdır')
    .regex(/[@$!%*?&]/, 'Ən az 1 xüsusi simvol olmalıdır (@$!%*?&)'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Parollar uyğun deyil',
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z
    .string()
    .email('Düzgün email ünvanı daxil edin'),
  password: z
    .string()
    .min(1, 'Parol daxil edin'),
})

export type LoginInput = z.infer<typeof loginSchema>
