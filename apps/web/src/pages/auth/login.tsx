import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, FieldError, Input, Label, TextField } from 'react-aria-components'
import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export default function Login() {
  const router = useRouter()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const submitForm = async (values: z.infer<typeof loginSchema>) => {
    const result = await signIn('login', {
      ...values,
      redirect: false,
    })

    const redirectUrl = router.query?.redirectUrl

    if (result?.ok) {
      if (redirectUrl) {
        router.push(redirectUrl as string)
      } else {
        router.push('/dashboard')
      }
    } else {
      toast(result?.error)
    }
  }

  return (
    <div>
      <div className="mx-auto mt-40 w-full max-w-[420px] px-5">
        <h2 className="mb-16 text-2xl font-semibold">Log in</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <TextField
                className="flex flex-col gap-1"
                isInvalid={fieldState.invalid}
                onChange={field.onChange}
                value={field.value}
                type="email"
              >
                <Label className="font-medium">Email</Label>
                <Input
                  className={({ isInvalid }) =>
                    `w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm outline-none transition-colors focus:outline-1 focus:outline-offset-1 focus:outline-zinc-300 ${isInvalid ? 'outline-1 outline-red-500' : ''}`
                  }
                />
                <FieldError className="mt-1 pl-1 text-xs text-red-500">
                  {fieldState.error?.message}
                </FieldError>
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <TextField
                className={() => `flex flex-col gap-1`}
                isInvalid={fieldState.invalid}
                onChange={field.onChange}
                value={field.value}
                type="password"
              >
                <Label className="font-medium">Password</Label>
                <Input
                  className={({ isInvalid }) =>
                    `w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm outline-none transition-colors focus:outline-1 focus:outline-offset-1 focus:outline-zinc-300 ${isInvalid ? 'outline-1 outline-red-500' : ''}`
                  }
                />
                <FieldError className="mt-1 pl-1 text-xs text-red-500">
                  {fieldState.error?.message}
                </FieldError>
              </TextField>
            )}
          />

          <Button
            className={() =>
              `w-full rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white`
            }
            type="submit"
          >
            Log in
          </Button>
        </form>

        <div className="mt-4 flex items-center gap-1 text-sm">
          <p>Don&apos;t have an account?</p>
          <Link href="/auth/signup" className="text-blue-500">
            Signup
          </Link>
        </div>
      </div>
    </div>
  )
}
