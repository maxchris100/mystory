"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Calendar,
    Car,
    Users,
    CheckCircle,
    Menu,
    X,
    ArrowRight,
    ShieldCheck,
    Clock,
    Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Data
const featuredCars = [
    {
        id: 1,
        name: "Toyota Avanza",
        type: "MPV",
        price: 35,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600",
        passengers: 7,
        transmission: "Automatic",
    },
    {
        id: 2,
        name: "Honda Brio",
        type: "City Car",
        price: 25,
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600",
        passengers: 4,
        transmission: "Automatic",
    },
    {
        id: 3,
        name: "Mitsubishi Xpander",
        type: "MPV",
        price: 40,
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=600",
        passengers: 7,
        transmission: "Manual",
    },
    {
        id: 4,
        name: "Toyota Fortuner",
        type: "SUV",
        price: 70,
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
        passengers: 7,
        transmission: "Automatic",
    },
];

export default function LandingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen w-full bg-background text-foreground overflow-x-hidden">

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logotext.png" alt="Renqar" width={100} height={32} className="object-contain" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="#" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="#cars" className="hover:text-primary transition-colors">Cars</Link>
                        <Link href="#services" className="hover:text-primary transition-colors">Services</Link>
                        <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/signin">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button>Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t p-4 bg-background absolute w-full shadow-lg flex flex-col gap-4">
                        <Link href="#" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link href="#cars" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Cars</Link>
                        <Link href="#services" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
                        <Link href="#contact" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                        <div className="flex flex-col gap-2 mt-2">
                            <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full">Sign In</Button>
                            </Link>
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-primary/5 blur-3xl rounded-full translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-2/3 bg-blue-500/5 blur-3xl rounded-full -translate-x-1/4" />

                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                                Top Rated Car Rental
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                                Drive Your <span className="text-primary">Dream</span> Car Today
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-lg">
                                Experience the freedom of the road with our premium fleet. Affordable rates, flexible booking, and 24/7 support.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button size="lg" className="gap-2">
                                    Book Now <ArrowRight size={16} />
                                </Button>
                                <Button size="lg" variant="outline">
                                    View Fleet
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                                <div className="flex items-center gap-1">
                                    <CheckCircle size={16} className="text-primary" /> No Hidden Fees
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle size={16} className="text-primary" /> Free Cancellation
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            {/* Placeholder Car Image */}
                            <div className="relative aspect-[4/3] w-full">
                                <Image
                                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000"
                                    alt="Premium Car"
                                    fill
                                    className="object-cover rounded-2xl shadow-2xl"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search Widget */}
                <section className="container mx-auto px-4 -mt-16 relative z-10">
                    <Card className="shadow-lg border-none bg-card/95 backdrop-blur">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Pick-up location" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Pick-up Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input type="date" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Return Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input type="date" className="pl-9" />
                                    </div>
                                </div>
                                <Button className="w-full" size="lg">Search Cars</Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Featured Cars */}
                <section id="cars" className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12 space-y-2">
                            <h2 className="text-3xl font-bold">Featured Vehicles</h2>
                            <p className="text-muted-foreground">Choose from our wide range of premium vehicles</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredCars.map((car) => (
                                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative aspect-video">
                                        <Image
                                            src={car.image}
                                            alt={car.name}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{car.name}</CardTitle>
                                                <CardDescription>{car.type}</CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-primary">${car.price}</span>
                                                <span className="text-xs text-muted-foreground block">/day</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                            <div className="flex items-center gap-1">
                                                <Users size={14} /> {car.passengers}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Car size={14} /> {car.transmission}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Button className="w-full" variant="outline">View Details</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-10 text-center">
                            <Button variant="secondary">View All Cars</Button>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section id="services" className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
                                <div className="p-4 rounded-full bg-primary/10 text-primary">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-xl font-semibold">Secure & Safe</h3>
                                <p className="text-muted-foreground">Every car is fully insured and regularly maintained for your safety.</p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
                                <div className="p-4 rounded-full bg-primary/10 text-primary">
                                    <Clock size={32} />
                                </div>
                                <h3 className="text-xl font-semibold">Fast Booking</h3>
                                <p className="text-muted-foreground">Book your dream car in minutes with our easy-to-use platform.</p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
                                <div className="p-4 rounded-full bg-primary/10 text-primary">
                                    <Headphones size={32} />
                                </div>
                                <h3 className="text-xl font-semibold">24/7 Support</h3>
                                <p className="text-muted-foreground">Our dedicated support team is always ready to assist you on the road.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Journey?</h2>
                        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                            Don&apos;t wait! Book your car now and get the best rates for your upcoming trip.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button size="lg" variant="secondary" className="font-semibold text-primary">
                                Book a Car Now
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 bg-muted/30 border-t" id="contact">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="space-y-4">
                            <Image src="/logotext.png" alt="Renqar" width={100} height={32} />
                            <p className="text-sm text-muted-foreground">
                                Premium car rental service providing quality vehicles for all your travel needs.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#" className="hover:text-primary">Home</Link></li>
                                <li><Link href="#cars" className="hover:text-primary">Cars</Link></li>
                                <li><Link href="#services" className="hover:text-primary">Services</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                                <li><Link href="#" className="hover:text-primary">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>123 Main Street, Jakarta</li>
                                <li>support@renqar.com</li>
                                <li>+62 877 7427 3627</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 Renqar. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
