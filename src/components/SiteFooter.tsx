import { CONTACT_DISPLAY_EMAIL, SITE_NAME } from "@/lib/constants";
import { SocialLinks } from "@/components/SocialLinks";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-start justify-between px-4 py-8 text-sm text-stone-500">
        <div>
          <p className="font-medium text-stone-700">{SITE_NAME}</p>
          <p className="mt-1">Contacto: {CONTACT_DISPLAY_EMAIL}</p>
          <p className="mt-4 text-xs text-stone-400">
            Sitio en fase Beta — grupopropiedadessantiago.cl
          </p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
