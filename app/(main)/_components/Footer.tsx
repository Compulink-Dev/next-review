import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-red-600 bg-white py-16 text-red-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">
                  <span>About us</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>Faq</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>Help</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>My account</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>Create account</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>Contacts</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">
                  <span>Shops</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>Hotels</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>Restaurants</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>Bars</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>Events</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span>View all</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <h3 className="text-lg font-semibold mb-4">Contacts</h3>
            <ul className="space-y-2">
              <li>14 4th Street Harare</li>
              <li>+27888221122</li>
              <li>
                <Link href="mailto:info@domain.com">info@domain.com</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Keep in touch</h3>
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="border p-2 rounded-md flex-grow border-red-600 placeholder:text-color"
              />
              <Button className="bg-red-600 text-white px-4 py-2 rounded-md">
                Submit
              </Button>
            </form>
            <div className="mt-4">
              <h5 className="text-sm font-semibold">Follow Us</h5>
              <div className="flex space-x-4 mt-2">
                <Link href="#" className="text-blue-700">
                  <Facebook />
                </Link>
                <Link href="#" className="text-blue-400">
                  <Twitter />
                </Link>
                <Link href="#" className="text-red-300">
                  <Instagram />
                </Link>
                <Link href="#" className="text-green-500">
                  <MessageCircle />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-8 border-red-600" />
        <div className="flex flex-col md:flex-row justify-between text-sm">
          <div>
            <select className="border p-2 rounded-md">
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="Russian">Russian</option>
            </select>
          </div>
          <ul className="flex space-x-4 mt-4 md:mt-0">
            <li>
              <Link href="#">
                <span>Terms and conditions</span>
              </Link>
            </li>
            <li>
              <Link href="#">
                <span>Privacy</span>
              </Link>
            </li>
            <li>© 2025 TechTrain</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
