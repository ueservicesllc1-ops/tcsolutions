import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  white?: boolean;
};

export function Logo({ compact = false, white = false }: LogoProps) {
  return (
    <Link href="/" className="flex items-center" aria-label="Total Cleaning Solutions home">
      <Image
        src="/tcs-logo.png"
        alt="Total Cleaning Solutions logo"
        width={compact ? 120 : 150}
        height={compact ? 44 : 54}
        className={`h-auto w-auto max-h-12 ${white ? "brightness-0 invert" : ""}`}
        priority
      />
    </Link>
  );
}
