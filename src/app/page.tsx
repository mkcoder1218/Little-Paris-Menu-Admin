import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center px-4">
        Restaurant Menu System
      </h1>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md px-4">
        <Link href="/admin/login" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-11 sm:h-12 text-base">
            Go to Admin Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
