import { Layout } from '@/components/Layout'
import { useGetProfile } from '@/hooks/useGetProfile'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React from 'react'
import { Button, FieldError, Input, Label, TextField } from 'react-aria-components'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const walletFormSchema = z.object({
  recipientId: z.string().trim(),
  accountId: z.string().trim(),
  amount: z
    .string()
    .trim()
    .refine(
      v => {
        let n = Number(v)
        return !isNaN(n) && v?.length > 0
      },
      { message: 'Invalid number' },
    ),
})

type WalletFormInput = z.infer<typeof walletFormSchema>

export default function Wallet() {
  const router = useRouter()

  const { data } = useGetProfile()

  const { control, handleSubmit, reset } = useForm<WalletFormInput>({
    defaultValues: {
      recipientId: '',
      amount: '',
      accountId: '',
    },
    resolver: zodResolver(walletFormSchema),
    mode: 'onBlur',
  })

  React.useEffect(() => {
    if (data?.account.id) {
      reset({ accountId: data?.account.id })
    }
  }, [data?.account])

  const sendMoney = (values: WalletFormInput) => {
    console.log(values)
  }

  return (
    <div>
      <Button className="mb-6 inline-flex items-center gap-1" onPress={router.back}>
        <ChevronLeftIcon className="h-5 w-5" />
        <p>Back</p>
      </Button>

      <h1 className="mb-4 text-2xl font-bold">Send to recipient's wallet</h1>

      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-5">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(sendMoney)}>
          <Controller
            control={control}
            name="recipientId"
            render={({ field, fieldState }) => (
              <TextField
                className="flex flex-col gap-1"
                isInvalid={fieldState.invalid}
                onChange={field.onChange}
                value={field.value}
              >
                <Label className="font-medium">User ID</Label>
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
            name="amount"
            render={({ field, fieldState }) => (
              <TextField
                className="flex flex-col gap-1"
                isInvalid={fieldState.invalid}
                onChange={field.onChange}
                value={field.value}
              >
                <Label className="font-medium">Amount (USD)</Label>
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
              `rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white`
            }
            type="submit"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}

Wallet.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}
