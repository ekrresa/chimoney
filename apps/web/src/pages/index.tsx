import Link from 'next/link'

export default function Home() {
  return (
    <section className="min-h-svh pt-20">
      <header className="mb-8 flex flex-col items-center px-5">
        <h1 className="mb-4 text-4xl font-bold">PeerCash</h1>
        <p className="text-lg">
          The fastest way to send and receive money worldwide. Click the buttons
          below to get started.
        </p>
      </header>

      <div className="">
        <div className="flex items-center justify-center gap-8">
          <Link
            href="/auth/login"
            className="rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white"
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  )
}
