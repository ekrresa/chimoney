import React from 'react'
import Link from 'next/link'
import { Button, Input, Label, TextField } from 'react-aria-components'

export default function Signup() {
  return (
    <div>
      <div className="mx-auto mt-40 w-full max-w-[420px] px-5">
        <h2 className="mb-16 text-center text-2xl font-semibold">Create your account</h2>

        <form className="flex flex-col gap-4">
          <TextField className={() => `flex flex-col gap-1`}>
            <Label className="font-medium">Name</Label>
            <Input
              className={() =>
                `w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm outline-none transition-colors focus:outline-1 focus:outline-offset-1 focus:outline-zinc-300`
              }
            />
          </TextField>

          <TextField className={() => `flex flex-col gap-1`} type="email">
            <Label className="font-medium">Email</Label>
            <Input
              className={() =>
                `w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm outline-none transition-colors focus:outline-1 focus:outline-offset-1 focus:outline-zinc-300`
              }
            />
          </TextField>

          <TextField className={() => `flex flex-col gap-1`} type="password">
            <Label className="font-medium">Password</Label>
            <Input
              className={() =>
                `w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm outline-none transition-colors focus:outline-1 focus:outline-offset-1 focus:outline-zinc-300`
              }
            />
          </TextField>

          <Button
            className={() =>
              `w-full rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white`
            }
          >
            Create account
          </Button>
        </form>

        <div className="mt-4 flex items-center gap-1 text-sm">
          <p>Already have an account?</p>
          <Link href="/auth/login" className="text-blue-500">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
