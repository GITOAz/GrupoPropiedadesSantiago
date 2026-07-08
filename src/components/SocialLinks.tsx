import { SOCIAL_LINKS } from "@/lib/constants";
import { IconFacebook, IconInstagram, IconLinkedin } from "@/components/icons";

const NETWORKS = [
  { key: "facebook", href: SOCIAL_LINKS.facebook, label: "Facebook", Icon: IconFacebook },
  { key: "instagram", href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: IconInstagram },
  { key: "linkedin", href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: IconLinkedin },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  const active = NETWORKS.filter((n) => n.href);
  if (active.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      {active.map(({ key, href, label, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-stone-500 transition hover:text-amber-700"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
