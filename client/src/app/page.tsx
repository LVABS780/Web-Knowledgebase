"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  Users,
  Zap,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function KnowledgeBaseLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 animate-slide-in-left">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                KnowledgeHub
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline underline-offset-4"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline underline-offset-4"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline underline-offset-4"
              >
                About
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in-up">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="mb-6 animate-fade-in-up"
            >
              🚀 New: AI-Powered Search
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up text-balance">
              Your Knowledge, <span className="text-primary">Organized</span>{" "}
              and <span className="text-primary">Accessible</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up text-pretty">
              Transform scattered information into a powerful, searchable
              knowledge base. Empower your team with instant access to critical
              information.
            </p>

            <div className="max-w-2xl mx-auto mb-8 animate-fade-in-up">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search for articles, guides, tutorials..."
                  className="pl-12 pr-4 py-6 text-lg bg-card border-2 hover:border-primary/50 focus:border-primary transition-colors duration-200"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
              <Link href="/login">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg group hover:scale-105 transition-transform duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border animate-fade-in-up">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">10K+</div>
                <div className="text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-muted-foreground">Teams</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-20 bg-muted/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
              Everything you need to manage knowledge
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Powerful features designed to make information discovery
              effortless and collaboration seamless.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Search</CardTitle>
                <CardDescription>
                  AI-powered search that understands context and finds exactly
                  what you need, even with partial queries.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Team Collaboration</CardTitle>
                <CardDescription>
                  Real-time editing, comments, and version control. Keep your
                  entire team on the same page.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized for speed with instant search results and seamless
                  navigation across all your content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Rich Content</CardTitle>
                <CardDescription>
                  Support for markdown, images, videos, and interactive elements
                  to create engaging documentation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Access Control</CardTitle>
                <CardDescription>
                  Granular permissions and role-based access to keep sensitive
                  information secure while enabling collaboration.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Analytics</CardTitle>
                <CardDescription>
                  Track usage patterns, popular content, and team engagement to
                  optimize your knowledge base.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-balance">
              Ready to transform your knowledge management?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Join thousands of teams who have already streamlined their
              information workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg group hover:scale-105 transition-transform duration-200 animate-pulse-subtle"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-200 bg-transparent"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      <footer className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">
                  KnowledgeHub
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering teams with organized, accessible knowledge.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 KnowledgeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
