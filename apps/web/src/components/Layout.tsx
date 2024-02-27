import React from 'react'
import Link from 'next/link'
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components'
import { signOut } from 'next-auth/react'
import { useGetProfile } from '@/hooks/useGetProfile'
import { getInitials } from '@/lib/utils'

export function Layout({ children }: React.PropsWithChildren) {
  const { data } = useGetProfile()

  const user = data?.user
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <div className="">
          <Link href="/dashboard" className="text-lg">
            PeerCash
          </Link>
        </div>

        <div className="">
          <MenuTrigger>
            <Button aria-label="Menu">{getInitials(user?.name ?? '')}</Button>
            <Popover className="font-sans">
              <Menu
                className="w-[150px] rounded-md border border-zinc-300 bg-white px-2 py-2 shadow-md"
                onAction={key => {
                  if (key === 'logout') {
                    signOut({ redirect: false })
                  }
                }}
              >
                <MenuItem className="text-center" id="logout">
                  Log out
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>
      </header>

      <section className="flex flex-1">
        <aside className="w-64 border-r border-zinc-200 px-5">
          <nav className="pt-20">
            <ul className="flex flex-col gap-4">
              <li className="rounded-lg bg-zinc-200">
                <Link href="/dashboard" className="block px-3 py-2">
                  Home
                </Link>
              </li>
              <li className="rounded-lg">
                <Link href="/dashboard/transactions" className="block px-3 py-2">
                  Transactions
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 bg-zinc-50 p-5">
          <div className="mx-auto max-w-2xl">{children}</div>
        </main>
      </section>
    </div>
  )
}
