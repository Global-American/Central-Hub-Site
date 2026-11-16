import Link from "next/link";
import LegalPage, {
  LegalContactDetails,
  type LegalSection,
} from "@/components/legal-page";

export const metadata = {
  title: "Cookie Policy - Global American LLC",
  description:
    "How the Global American LLC website uses cookies and similar technologies, which third parties may set them, and how you can control them.",
};

// Everything on the site that can set a cookie or similar storage. Keep this
// in step with the code: add a row whenever a new third-party script, embed
// or analytics tool goes in.
const cookieProviders = [
  {
    provider: "Cloudflare Turnstile",
    where: "Contact, quote and account forms",
    purpose:
      "A security check that tells people from automated traffic before a form unlocks. It works mainly by issuing a one-time token, and Cloudflare may also set security cookies (such as cf_clearance or cf_chl_rc_m) in your browser.",
    type: "Strictly necessary",
    duration: "Set by Cloudflare; session or short-lived",
  },
  {
    provider: "Google Maps",
    where: "Street maps of our facilities on the About Us page",
    purpose:
      "Displays an interactive map when you select a facility. Google may set cookies (such as NID) to remember your preferences and, under its own policies, for its own purposes including advertising on Google services.",
    type: "Third-party functionality",
    duration: "Set by Google; NID lasts up to 6 months",
  },
];

const sections: LegalSection[] = [
  {
    id: "what-are-cookies",
    title: "What cookies are",
    content: (
      <>
        <p>
          Cookies are small text files that a website stores in your browser.
          They are widely used to make websites work, keep them secure,
          remember your preferences and measure how they are used. Cookies set
          by the website you are visiting are &ldquo;first-party&rdquo;
          cookies. Cookies set by another company, for example through an
          embedded map, are &ldquo;third-party&rdquo; cookies.
        </p>
        <p>
          Similar technologies, such as local storage in your browser, do a
          comparable job. This policy uses &ldquo;cookies&rdquo; to mean all
          of them.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-cookies",
    title: "How we use cookies",
    content: (
      <>
        <p>We keep cookies on this website to a minimum:</p>
        <ul>
          <li>
            <strong>We do not set any cookies of our own.</strong> The website
            does not need a login, and it does not store first-party cookies in
            your browser.
          </li>
          <li>
            <strong>We do not use advertising or analytics cookies.</strong>{" "}
            There are no advertising trackers and no third-party analytics
            tools on this website.
          </li>
          <li>
            <strong>Two third-party features may use cookies:</strong> the
            security check that protects our forms, and the maps of our
            facilities. These are described below.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies-on-this-website",
    title: "Cookies on this website",
    content: (
      <>
        <p>
          These are the third-party features on this website that may set
          cookies. Each is only loaded on the pages where it is used.
        </p>
        <div className="legal-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Provider</th>
                <th scope="col">Where it is used</th>
                <th scope="col">What it does</th>
                <th scope="col">Type</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {cookieProviders.map((row) => (
                <tr key={row.provider}>
                  <td>
                    <strong>{row.provider}</strong>
                  </td>
                  <td>{row.where}</td>
                  <td>{row.purpose}</td>
                  <td>{row.type}</td>
                  <td>{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          These cookies are set and controlled by the provider, not by us. You
          can read more in{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare&rsquo;s privacy policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/technologies/cookies"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&rsquo;s explanation of how it uses cookies
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "other-websites",
    title: "Other websites we link to",
    content: (
      <p>
        This website links to our brand platforms (Ship itSmart, Freight
        itSmart, Return itSmart and Fulfill itSmart), partner platforms and
        social media. Those websites set their own cookies under their own
        policies once you visit them. This policy covers this website only.
      </p>
    ),
  },
  {
    id: "managing-cookies",
    title: "How to control cookies",
    content: (
      <>
        <p>
          You can control cookies through your browser settings. Most browsers
          let you see which cookies are stored, delete them, and block cookies
          from some or all websites, including third-party cookies. Your
          browser&rsquo;s help pages explain how.
        </p>
        <p>Please bear in mind:</p>
        <ul>
          <li>
            If you block the security check, our forms may not unlock. You can
            still reach us by phone using the details below.
          </li>
          <li>
            Google Maps only loads when you select a facility on the map. If
            you would rather not load it, our addresses are shown in the list
            beside the map.
          </li>
          <li>
            Cookie settings apply to each browser and device separately, so
            you will need to set them wherever you browse.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We will update this policy if we change the cookies used on this
        website, for example if we add new features or tools. The date at the
        top of the page shows when it was last updated.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>
          If you have a question about how we use cookies, please contact us.
          For more about how we handle personal information, see our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <LegalContactDetails />
      </>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage
      current="/cookies"
      title="Cookie"
      accent="Policy"
      updated="November 16, 2026"
      intro={
        <p>
          This policy explains how cookies and similar technologies are used
          on the Global American LLC website, and the choices you have.
        </p>
      }
      sections={sections}
    />
  );
}
