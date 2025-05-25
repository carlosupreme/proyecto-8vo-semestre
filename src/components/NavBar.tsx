import { navItems } from "./nav-items";
import NavItem from "./NavItem";

const NavBar = () => {
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary rounded-3xl shadow-lg z-50 px-4 py-2 max-w-md w-11/12">
            <nav className="">
                <ul className="flex justify-around items-center w-full">
                    {navItems.map((item) => (
                        <NavItem key={item.to} item={item} />
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default NavBar;

