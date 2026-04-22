import { Logo } from "./logo";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-[#071F33] py-14 text-white">
      <div className="container-shell grid gap-10 md:grid-cols-3">
        <div>
          <Logo white />
          <p className="mt-4 max-w-sm text-white/75">
            Premium cleaning solutions for New Jersey commercial, office, post-construction, and
            residential properties.
          </p>
          <p className="mt-4 font-semibold text-[#8CC3EC]">Clean Spaces, Better Places.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold">Navigation</h4>
          <nav className="mt-4 flex flex-col gap-2">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="text-white/80 transition-colors hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <h4 className="text-lg font-bold">Contact</h4>
          <div className="mt-4 space-y-2 text-white/80">
            <p>Phone: 551-301-9412</p>
            <p>Email: tcleaningsolutions@gmail.com</p>
            <p>Website: tcleaningsolutions.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
