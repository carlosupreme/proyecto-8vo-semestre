import NavBar from "./NavBar"

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {children}
            <NavBar />
        </div>
    )
}