import { Link } from "react-router-dom";
import logo from "../../assets/logo.webp";
import { LazyLoadImage } from "react-lazy-load-image-component";

export function Footer() {
    return (
        <footer className="bg-white shadow-lg border-t mt-10 border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo y redes sociales */}
                    <LogoSection />
                    
                    {/* Enlaces rápidos */}
                    <QuickLinksSection />
                    
                    {/* Enlaces legales */}
                    <LegalSection />
                    
                    {/* Información de contacto */}
                    <ContactSection />
                </div>

                {/* Copyright y enlaces adicionales */}
                <FooterBottom />
            </div>
        </footer>
    );
}

// Componente para la sección del logo y redes sociales
function LogoSection() {
    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Link to="/">
                    <LazyLoadImage
                        className="h-8 w-auto"
                        src={logo}
                        alt="Logo de la pagina"
                    />
                </Link>
            </div>
            <p className="text-gray-500 text-sm">
                Encontra los mejores fotografos en un solo lugar.
            </p>
            <SocialMediaLinks />
        </div>
    );
}

// Componente para los iconos de redes sociales
function SocialMediaLinks() {
    return (
        <div className="flex space-x-4">
            <SocialLink 
            link={"https://youtube.com/@fotografiacatamarca?si=N1OSAySNbLEe8wAM"}
                name="youtube" 
                path={<i className="bi bi-youtube"></i>}
                 />
            
            
        </div>
    );
}

// Componente para enlaces de redes sociales individuales
function SocialLink({ name, path, link }) {
    return (
        <a 
            href={link || "#"} 
            className="text-gray-400 hover:text-[var(--color-base-claro)]"
            target="_blank"
            rel="noopener noreferrer"
        >
            <span className="sr-only">{name}</span>
            {path}
        </a>
    );
}


// Componente para la sección de enlaces rápidos
function QuickLinksSection() {
    return (
        <div>
            <SectionTitle>Enlaces rápidos</SectionTitle>
            <ul className="mt-4 space-y-2">
                <FooterLink to="/" text="Inicio" />
                <FooterLink to="/fotografos" text="Fotógrafos" />
                <FooterLink to="/galerias" text="Galerías" />
                <FooterLink to="/eventos" text="Eventos" />
            </ul>
        </div>
    );
}

// Componente para la sección legal
function LegalSection() {
    return (
        <div>
            <SectionTitle>Legal</SectionTitle>
            <ul className="mt-4 space-y-2">
                <FooterLink to="/privacidad" text="Política de privacidad" />
                <FooterLink to="/terminos" text="Términos de servicio" />
                <FooterLink to="/cookies" text="Política de cookies" />
                <FooterLink to="/derechos" text="Derechos de autor" />
            </ul>
        </div>
    );
}

// Componente para la sección de contacto
function ContactSection() {
    return (
        <div>
            <SectionTitle>Contacto</SectionTitle>
            <ul className="mt-4 space-y-2">
                <li className="text-gray-500 text-sm">
                    Email: <a href="mailto:equipo@fotografoscatamarca.com" className="hover:text-[var(--color-base-claro)]">equipo@fotografoscatamarca.com</a>
                </li>
            </ul>
        </div>
    );
}

// Componente para el pie de página inferior (copyright)
function FooterBottom() {
    return (
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <FooterLink to="/mapa-sitio" text="Mapa del sitio" className="text-xs" />
                <FooterLink to="/faq" text="Preguntas frecuentes" className="text-xs" />
                <FooterLink to="/soporte" text="Soporte técnico" className="text-xs" />
            </div>
        </div>
    );
}

// Componente reutilizable para títulos de sección
function SectionTitle({ children }) {
    return (
        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
            {children}
        </h3>
    );
}

// Componente reutilizable para enlaces del footer
function FooterLink({ to, text, className = "text-sm" }) {
    return (
        <li>
            <Link 
                to={to} 
                className={`text-gray-500 hover:text-[var(--color-base-claro)] ${className}`}
            >
                {text}
            </Link>
        </li>
    );
}