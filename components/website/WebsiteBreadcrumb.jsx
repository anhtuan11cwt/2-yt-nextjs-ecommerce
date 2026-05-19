import { ChevronRight } from "lucide-react";
import Link from "next/link";

// Component breadcrumb điều hướng
export default function WebsiteBreadcrumb({ links = [] }) {
  return (
    <section className="bg-gray-50 px-4 py-6 lg:px-32">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        {links.map((link, index) => (
          <span className="flex items-center gap-2" key={link.label}>
            {index > 0 && <ChevronRight size={14} />}

            {link.href ? (
              <Link
                className="transition-colors hover:text-black"
                href={link.href}
              >
                {link.label}
              </Link>
            ) : (
              <span className="font-medium text-black">{link.label}</span>
            )}
          </span>
        ))}
      </nav>
    </section>
  );
}
