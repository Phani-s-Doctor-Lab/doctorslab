import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const PathologyServices = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background-color)] text-[var(--text-primary)]" style={{
            "--primary-color": "#649ccd",
            "--secondary-color": "#D3D3D3",
            "--text-primary": "#111518",
            "--text-secondary": "#637988",
            "--background-color": "#ffffff",
            fontFamily: "'Public Sans', sans-serif"
        }}>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex h-20 items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* SVG Logo */}
                    <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6_543)">
                        <path d="M42.1739 ... Z" fill="currentColor"></path>
                        <path clipRule="evenodd" d="M7.24189 ... Z" fill="currentColor" fillRule="evenodd"></path>
                    </g>
                    <defs>
                        <clipPath id="clip0_6_543"><rect fill="white" height="48" width="48"></rect></clipPath>
                    </defs>
                    </svg>
                    <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Pathology Services</h1>
                </div>
                <nav className="hidden items-center gap-8 lg:flex">
                    <a className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors" href="#">Services</a>
                    <a className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors" href="#">Locations</a>
                    <a className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors" href="#">For Patients</a>
                    <a className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors" href="#">For Providers</a>
                    <a className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors" href="#">About Us</a>
                </nav>
                <div className="flex items-center gap-2">
                    <div onClick={() => navigate("/login")} className="hidden sm:inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-bold bg-[var(--secondary-color)] text-[var(--text-primary)] hover:bg-gray-400 transition-colors">Sign In</div>
                    <a className="inline-flex items-center justify-center rounded-md h-10 px-4 text-sm font-bold bg-[var(--primary-color)] text-white hover:bg-teal-900 transition-colors shadow-md" href="#">
                    Book an Appointment
                    </a>
                </div>
                </div>
            </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
            {/* Hero Section */}
            <section className="relative flex items-center justify-center h-[560px] bg-cover bg-center"
                style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAhrxBALM87okPJCn63h849KZ0i-1OpyMzY0tUf3NjCamxAKQGeY3bDwbI21Bk_tkjzaZRffsF75MXKKknc-hk4OAVdI6hZCGR01o_xMtWOzYDdMTHFpkr4zwFpqr1_AKttgjyTk_CQDGN4AkuwuRr6OeAeeXFS7htH4DCHrdt0vo7SbkhKLWZvSGeerZWvjCfCwxfTp_JRCFaSK-5OBN7n0MleAzYbgOPpvRfkvlU-t9XZBrWpsjI0gEwS_HtxA9JY6u3O5xyW")`
                }}>
                <div className="container mx-auto px-6 text-center text-white">
                <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter mb-4">Comprehensive Pathology Services</h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl font-light mb-8">Providing accurate and timely diagnostic testing to support patient care and wellness.</p>
                <a className="inline-flex items-center justify-center rounded-md h-12 px-6 text-base font-bold bg-[var(--primary-color)] text-white hover:bg-teal-900 transition-colors shadow-lg" href="#">
                    Explore Services
                </a>
                </div>
            </section>

            {/* Test Categories */}
            <section className="py-16 sm:py-24 bg-gray-100">
                <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">Our Test Categories</h2>
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">A wide range of tests to meet your healthcare needs.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Card 1 */}
                    <div className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex-shrink-0">
                        <img alt="Blood Tests" className="h-48 w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr4zG3LhOpY9i1fJPZWpAfhvEmng91F6n8nG9WrAgB_tiSFjbI23zfFlC31Phk61IAEujzor5pHj8lnHbBexBWWJiX3QRlnDWAYyqneZ6be9egljvAMZUBTsATi8thzHpXs00hrek6UipK2MSwmhs3xjH3nyc6cEAH9co-0Prbf6lC2BxwUHggd7NP_mGJ_P9LzaUWqbD7mfOFNuAp4rfS8ySu1VDb4nxPXj9JK2bbDlZLyFyeOGEtCfpxCgUZmWfMZ_rZ0R4y" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                        <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Blood Tests</h3>
                        <p className="mt-3 text-base text-[var(--text-secondary)]">Complete blood count, cholesterol levels, and more.</p>
                        </div>
                    </div>
                    </div>
                    {/* Card 2 */}
                    <div className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex-shrink-0">
                        <img alt="Hormone Tests" className="h-48 w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq8rvRsxKVlaX8Q608hsllPuWE33VIeztN18Nm8cHIbtP9FqMz7Pk5OqLfWbeozww-8d_ea44O0rRcCKzvbpQJcI1ymI8V0NbO7hiPYrSKuntLh1lfBcr_WCp1iYZOgAKWQVXyM_IIyO7zIdjUVcvS9nIx-Xoq75WcfYC6Mg6wV_RgLTozWyiTmIyYW7v7XFoeZJawGcV5MVo-FhlJl_fTRy6WzUlKKW_0SEm7gRef0KQgngziknsjGqCZTj5Y1d2Euul_cZsR" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                        <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Hormone Tests</h3>
                        <p className="mt-3 text-base text-[var(--text-secondary)]">Thyroid function, reproductive hormones, and other endocrine tests.</p>
                        </div>
                    </div>
                    </div>
                    {/* Card 3 */}
                    <div className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex-shrink-0">
                        <img alt="Microbiology" className="h-48 w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS4VF2boJIb0Ag8KD4OJ4-Y-HBRMFj3WZzbnxmSI-hwZ_iDemd5i_sM42KM7nAP7c7yKrXdD0OqAV1C2Ikl8NRrnPHIVjIiZ81ZFsRDYUc28y3Qs_BHKtIZcEiBecJ14NGFFd-jGuszM-aNWoIZtSUMC2z1WVGPHickv1_7VIxekRiwdzaS8WyRUKlXvIHx6cWxMkIvPsDAA7GJ1SYaAVumHIhwlS9BWPpxsEHqD8vKjLLfXvXrIVMbplbPEykzpPhQnNjmDR_" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                        <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Microbiology</h3>
                        <p className="mt-3 text-base text-[var(--text-secondary)]">Bacterial, viral, and fungal cultures and identification.</p>
                        </div>
                    </div>
                    </div>
                    {/* Card 4 */}
                    <div className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex-shrink-0">
                        <img alt="Specialized Tests" className="h-48 w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbYuvZ8PNg7OOsi6MxKsXyh69Zv1T3YOvCcmKkkyTbbeK2Hiu_Lo0oIEdpeAL8Clh6WLY0YIkBxWHkHNGs6s9TIztyr3nSRtPf_N0MuJFDsIitwuD0yP5pz8VRL_Seq2Yx1mGa3jmIzcTMKJ-Raf2Kgpl9305_ot3gPoqB0aHzK8dNJ7y_nrbS7y0mgKqACkUGngyaWx-lAo0BdDy8ookSJ2CAmDWXT88ZSTzN-Y5zaneCy3RXJGurOjtB0rNImCXyCdZzDn0Y" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                        <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Specialized Tests</h3>
                        <p className="mt-3 text-base text-[var(--text-secondary)]">Genetic testing, cancer screening, and other advanced diagnostics.</p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </section>

            {/* Healthcare Information */}
            <section className="py-16 sm:py-24 bg-[var(--background-color)]">
                <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">Healthcare Information</h2>
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">Empowering you with knowledge for better health outcomes.</p>
                </div>
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1">
                        <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">Preventive Care</h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                        Regular check-ups and screenings are essential for maintaining good health. Learn more about our preventive care services.
                        </p>
                        <a className="font-bold text-[var(--primary-color)] hover:text-teal-900" href="#">Learn More →</a>
                    </div>
                    <div className="order-1 md:order-2">
                        <img alt="Preventive Care" className="rounded-lg shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoLe7aRJ7yjVzuviuhTCs-Wn9DGOqdBEcuBIKDxDRh4GWAkmy9weeJE8pemDTBvlE71Xg9G7-s1ciqYHmZK2NWMrLjcWKZjOxNEWOoPVpzflLNfHG4hTMsNUpzTv1j1IW1t8ekmhpT8UXEfjINt2bmKqZ5RJm2Mgoi97M7pcnE1U3Nt-8oFhKsr9PG-ZR7PEzA3WaMgnC-Icv1PXZtV5m6jLKFngBsm3B-6ZUPIExy1c7Bqk1vceJEb7rfweheeatYdyAbqbxm" />
                    </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <img alt="Patient Resources" className="rounded-lg shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRji_qs3WGnS8H4z7U6Okiunb7Tx6FmZg72wCoE_1wK0RLxYJm7uPJ0J5OmaYBbm-V_KXkZjz_g6z0bTrsex-U9iWLIAD7mrB_OVYWl9EQ4hlH7CwfHhc62ahMV9Pdtwp2DzzI6OOZKvBJox3hIWOyVtw7hDV339Bg0c7dI1OCRJc9FEF4Ud1mpaE0s4pQHmAcHVuEt4DoMGrFTeV_rRf2DtfS2NEvnju2mHfJajdVn3iGZf3QX-BT4xGuVKOBUIteMMh-oFh1" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">Patient Resources</h3>
                        <p className="text-[var(--text-secondary)] mb-6">Access helpful information about preparing for your tests, understanding your results, and more.</p>
                        <a className="font-bold text-[var(--primary-color)] hover:text-teal-900" href="#">View Resources →</a>
                    </div>
                    </div>
                </div>
                </div>
            </section>

            {/* Booking Section */}
            <section className="bg-[var(--secondary-color)]">
                <div className="container mx-auto px-6 py-16 sm:py-20 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">Ready to Book Your Test?</h2>
                <p className="mt-4 mb-8 max-w-2xl mx-auto text-lg text-gray-700">Schedule your appointment online today. It's quick, easy, and secure.</p>
                <a className="inline-flex items-center justify-center rounded-md h-12 px-6 text-base font-bold bg-[var(--primary-color)] text-white hover:bg-teal-900 transition-colors shadow-lg" href="#">
                    Book an Appointment
                </a>
                </div>
            </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                <div className="flex items-center gap-3 mb-6 lg:mb-0">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6_543_footer)">
                        <path d="M42.1739 ... Z" fill="currentColor"></path>
                        <path clipRule="evenodd" d="M7.24189 ... Z" fill="currentColor" fillRule="evenodd"></path>
                    </g>
                    <defs>
                        <clipPath id="clip0_6_543_footer"><rect fill="white" height="48" width="48"></rect></clipPath>
                    </defs>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Pathology Services</h2>
                </div>
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 lg:mb-0">
                    <a className="text-sm text-gray-400 hover:text-white transition-colors" href="#">Privacy Policy</a>
                    <a className="text-sm text-gray-400 hover:text-white transition-colors" href="#">Terms of Service</a>
                    <a className="text-sm text-gray-400 hover:text-white transition-colors" href="#">Contact Us</a>
                </nav>
                <p className="text-sm text-gray-500">© 2024 Pathology Services. All rights reserved.</p>
                </div>
            </div>
            </footer>
        </div>
    );
};

export default PathologyServices;
