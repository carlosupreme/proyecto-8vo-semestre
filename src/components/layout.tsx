import NavBar from "./NavBar"

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex flex-col min-h-screen w-full">
            <div className="flex-1 h-full">
                {children}
            </div>
            <NavBar />
        </main>
    )
}