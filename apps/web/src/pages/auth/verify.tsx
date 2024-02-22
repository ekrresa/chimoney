import { useRouter } from 'next/router'
import { Button, FieldError, Input, Label, TextField } from 'react-aria-components'
import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

const verifyEmailSchema = z.object({
  code: z.string().length(6, 'Code must be 6 characters long').trim(),
})

export default function Verify() {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(verifyEmailSchema),
  })

  const submitForm = async (values: z.infer<typeof verifyEmailSchema>) => {
    const result = await signIn('verify', {
      ...values,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/')
    } else {
      toast(result?.error)
    }
  }

  return (
    <div>
      <div className="mx-auto mt-40 w-full max-w-[420px] px-5">
        <header className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Verify your email</h2>
          <p className="">Enter the code sent to your email</p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
          <Controller
            control={control}
            name="code"
            render={({ field, fieldState }) => (
              <TextField
                className="flex flex-col gap-1"
                isInvalid={fieldState.invalid}
                onChange={field.onChange}
                value={field.value}
                type="text"
              >
                <Label className="font-medium">Code</Label>
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
            {isSubmitting ? 'Loading...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  )
}
