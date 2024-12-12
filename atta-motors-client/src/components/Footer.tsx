import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Phone } from "lucide-react";
import { FC } from "react";

interface FooterProps {}

export const Footer: FC<FooterProps> = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground">
              CarHub is your one-stop destination for buying, selling, and
              maintaining quality vehicles.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Buy a Car
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Sell Your Car
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Services
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>123 Car Street, Autoville</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@carhub.com</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="WhatsApp"
              >
                <Phone className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CarHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
