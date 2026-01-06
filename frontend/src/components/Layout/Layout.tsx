import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden max-w-full">
      <Header />
      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout

