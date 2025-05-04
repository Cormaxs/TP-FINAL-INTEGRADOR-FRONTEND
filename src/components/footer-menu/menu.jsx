import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { CrudContext } from "../../context/api/crud-user";
import logo from "../../assets/logo.webp";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ContextTheme } from '../../context/theme/theme';


export function Menu() {
    // Contexto y estado
    const { token, decodificado } = useContext(CrudContext);
    const { dark, toggleTheme } = useContext(ContextTheme);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Manejo del menú móvil
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const isActive = (path) => location.pathname === path;

    // Determina si el usuario está autenticado
    const isAuthenticated = token && decodificado;

    return (
        <nav className="bg-white shadow-lg  top-0 z-30 w-full fixed">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Logo />
                    <button
                        onClick={toggleTheme}
                        className={`px-2  transition-colors duration-300 cursor-pointer rounded-2xl h-[40px]
                        ${dark ? 'bg-amber-200 text-black hover:bg-amber-300' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                        aria-label="Cambiar tema"
                    >
                        {dark ? (
                            <i className="bi bi-brightness-high text-xl"></i>
                        ) : (
                            <i className="bi bi-moon-fill text-xl"></i>
                        )}
                    </button>

                    {/* Menú de escritorio */}
                    <DesktopMenu
                        isAuthenticated={isAuthenticated}
                        isActive={isActive}
                        decodificado={decodificado}
                    />

                    {/* Menú móvil - Botón y perfil */}
                    <MobileMenuButton
                        isAuthenticated={isAuthenticated}
                        decodificado={decodificado}
                        toggleMobileMenu={toggleMobileMenu}
                        isMobileMenuOpen={isMobileMenuOpen}
                    />
                </div>
            </div>

            {/* Menú móvil desplegable */}
            {isMobileMenuOpen && (
                <MobileDropdownMenu
                    toggleMobileMenu={toggleMobileMenu}
                    isAuthenticated={isAuthenticated}
                />
            )}

        </nav>
    );
}

// Componente para el logo
function Logo() {
    return (
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <Link to="/">
                    <LazyLoadImage
                        className="h-8 w-auto"
                        src={logo}
                        alt="Logo de la página"
                    />
                </Link>
            </div>
        </div>
    );
}

// Componente para el menú de escritorio
function DesktopMenu({ isAuthenticated, isActive, decodificado }) {
    return (
        <div className="hidden sm:flex sm:items-center sm:space-x-8">

            <NavLink to="/" isActive={isActive('/')}>
                Home
            </NavLink>

            <NavLink to="/fotografos" isActive={isActive('/fotografos')}>
                Fotógrafos
            </NavLink>

            {isAuthenticated ? (
                <ProfileButton
                    to={`/perfil/${decodificado.id}`}
                    className="bg-[var(--color-primario)] hover:bg-[var(--color-acento)]"
                    text="Mi Perfil"
                />
            ) : (
                <AuthButtons />
            )}
        </div>
    );
}

// Componente para los botones de autenticación
function AuthButtons() {
    return (
        <div className="flex space-x-4">
            <ProfileButton
                to="/Login"
                className="bg-[var(--color-base-claro)] text-white hover:bg-[var(--color-primario)]"
                text="Iniciar Sesión"
            />

            <ProfileButton
                to="/Register"
                className="bg-[var(--color-secundario)] hover:bg-[var(--color-primario)]"
                text="Registrarse"
            />
        </div>
    );
}

// Componente para enlaces de navegación
function NavLink({ to, isActive, children }) {
    return (
        <Link
            to={to}
            className={`${isActive ?
                'border-[var(--color-primario)] text-[var(--texto-oscuro)]' :
                'border-transparent text-gray-500 hover:border-[var(--hover-claro)] hover:text-[var(--texto-oscuro)]'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
        >
            {children}
        </Link>
    );
}

// Componente reutilizable para botones de perfil
function ProfileButton({ to, className, text }) {
    return (
        <Link
            to={to}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[var(--texto-btn)] ${className}`}
        >
            {text}
        </Link>
    );
}

// Componente para el botón del menú móvil
function MobileMenuButton({ isAuthenticated, decodificado, toggleMobileMenu, isMobileMenuOpen }) {
    return (
        <div className="sm:hidden flex items-center">
            {isAuthenticated && (
                <ProfileButton
                    to={`/perfil/${decodificado.id}`}
                    className="bg-[var(--color-primario)] hover:bg-[var(--color-acento)] mr-4 px-3 py-1 text-xs"
                    text="Mi Perfil"
                />
            )}

            <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-[var(--hover-claro)]"
                onClick={toggleMobileMenu}
            >
                <span className="sr-only">Abrir menú</span>
                <MenuIcon isOpen={isMobileMenuOpen} />
            </button>
        </div>
    );
}

// Componente para el icono del menú móvil
function MenuIcon({ isOpen }) {
    return (
        <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
        </svg>
    );
}

// Componente para el menú desplegable móvil
function MobileDropdownMenu({ toggleMobileMenu, isAuthenticated }) {
    return (
        <div className="sm:hidden bg-white shadow-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
                <MobileNavLink to="/" onClick={toggleMobileMenu}>
                    Home
                </MobileNavLink>

                <MobileNavLink to="/fotografos" onClick={toggleMobileMenu}>
                    Fotógrafos
                </MobileNavLink>

                {!isAuthenticated && (
                    <>
                        <MobileNavLink to="/Login" onClick={toggleMobileMenu}>
                            Iniciar Sesión
                        </MobileNavLink>

                        <MobileNavLink to="/Register" onClick={toggleMobileMenu}>
                            Registrarse
                        </MobileNavLink>
                    </>
                )}
            </div>
        </div>
    );
}

// Componente para enlaces del menú móvil
function MobileNavLink({ to, onClick, children }) {
    return (
        <Link
            to={to}
            className="block px-3 py-2 rounded-md text-base font-medium text-[var(--texto-oscuro)] hover:bg-[var(--hover-claro)]"
            onClick={onClick}
        >
            {children}
        </Link>
    );
}