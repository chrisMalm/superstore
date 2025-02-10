import '@/assets/styles/globals.css'
import Footer from '@/components/Footer'
import Header from '@/components/shared/header/index'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="main flex-1 wrapper">{children}</div>
            <Footer />
        </div>
    )
}
