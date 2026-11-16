import Link from "next/link";
import LegalPage, {
  LegalContactDetails,
  type LegalSection,
} from "@/components/legal-page";

export const metadata = {
  title: "Privacy Policy - Global American LLC",
  description:
    "How Global American LLC collects, uses, shares and protects personal information when you use our website, request a quote or apply for an account.",
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          Global American LLC (&ldquo;Global American&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo; or &ldquo;our&rdquo;) is a logistics company based
          in Englewood, New Jersey, USA, with facilities in the United Kingdom,
          Ireland and China. We provide shipping, freight, returns and
          fulfillment services through our Ship itSmart, Freight itSmart,
          Return itSmart and Fulfill itSmart brands.
        </p>
        <p>
          This policy covers the personal information we handle through this
          website, including the contact form, quote requests and account
          applications. Global American LLC is the business responsible for
          that information (the &ldquo;controller&rdquo; under UK and EU data
          protection law).
        </p>
        <p>
          Our brand platforms and the partner platforms linked from this
          website are separate websites. When you use them, the privacy notice
          shown on that site applies.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <>
        <h3>Information you give us</h3>
        <ul>
          <li>
            <strong>Contact form.</strong> Your name, company, email address,
            phone number, country, the services you are interested in and the
            message you send us.
          </li>
          <li>
            <strong>Quote requests.</strong> Your name, email address and phone
            number, together with the details of the shipment: where it is
            coming from and going to, package or pallet dimensions and weights,
            what is being shipped (including whether it contains dangerous
            goods), the value to be insured, customs clearance options and when
            the cargo will be ready.
          </li>
          <li>
            <strong>Account applications.</strong> Your company and legal
            names, industry, website, company and billing addresses, billing
            currency, expected monthly spend, company registration and VAT or
            tax ID numbers, customs and tax details (such as EORI, IOSS, PVA,
            duty deferment and customs bond account numbers, TSA Known Shipper
            status and US federal tax classification), the names, roles, email
            addresses and phone numbers of your company contacts, and the name
            you type as your signature.
          </li>
          <li>
            <strong>Other contact with us.</strong> Anything you choose to tell
            us by phone, email or post.
          </li>
        </ul>

        <h3>Information collected automatically</h3>
        <ul>
          <li>
            <strong>Technical data.</strong> Like most websites, our hosting
            provider records standard server log information when you visit,
            such as your IP address, browser and device type, the pages
            requested and the date and time.
          </li>
          <li>
            <strong>Security checks.</strong> Our forms are protected by
            Cloudflare Turnstile, which uses your IP address and browser and
            device signals to tell people from automated traffic.
          </li>
          <li>
            <strong>Embedded maps.</strong> If you open a street map of one of
            our facilities, the map is loaded from Google Maps and Google
            receives your IP address and browser information.
          </li>
        </ul>
        <p>
          We do not use advertising trackers or third-party analytics on this
          website. See our <Link href="/cookies">Cookie Policy</Link> for more
          detail.
        </p>

        <h3>Information from others</h3>
        <p>
          We may receive information about you from your employer or
          colleagues (for example when they name you as a contact on an account
          application) and from carriers, customs brokers and other logistics
          partners while we handle a shipment.
        </p>
        <p>
          If you give us information about someone else, such as a consignee
          or a colleague, please make sure they know you are doing so and
          understand how we will use it.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How we use your information",
    content: (
      <>
        <p>We use personal information to:</p>
        <ul>
          <li>reply to your enquiries and messages;</li>
          <li>prepare quotes and follow up on them with you;</li>
          <li>review account applications and open and manage accounts;</li>
          <li>
            arrange and deliver the shipping, freight, returns and fulfillment
            services you ask for, including customs clearance;
          </li>
          <li>
            send service messages, and tell you about our services where you
            have asked us to or where the law allows (you can opt out at any
            time);
          </li>
          <li>
            keep our website and forms secure and prevent spam, fraud and
            abuse;
          </li>
          <li>
            meet our legal obligations, including customs, tax, export control
            and record-keeping requirements; and
          </li>
          <li>maintain and improve our website and services.</li>
        </ul>

        <h3>Legal bases (UK and EEA)</h3>
        <p>
          Where UK or EU data protection law applies, we rely on one or more of
          these legal bases:
        </p>
        <ul>
          <li>
            <strong>Contract.</strong> To take steps you ask for before
            entering into a contract (such as preparing a quote or opening an
            account) and to perform our contract with you.
          </li>
          <li>
            <strong>Legitimate interests.</strong> To answer enquiries, run and
            secure our website, and develop our business, where these interests
            are not overridden by your rights.
          </li>
          <li>
            <strong>Legal obligation.</strong> To comply with customs, tax and
            other laws that apply to us.
          </li>
          <li>
            <strong>Consent.</strong> Where we ask for it, for example for
            certain marketing messages. You can withdraw consent at any time.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-share-information",
    title: "How we share your information",
    content: (
      <>
        <p>
          We do not sell your personal information, and we do not share it
          with third parties for their own advertising. We share it only with:
        </p>
        <ul>
          <li>
            <strong>Our brands and affiliates</strong> (Ship itSmart, Freight
            itSmart, Return itSmart and Fulfill itSmart) so the right team can
            deal with your request.
          </li>
          <li>
            <strong>Service providers</strong> that work on our behalf, such as
            website hosting, security (Cloudflare), email delivery, and the
            customer management and billing systems where we store enquiries,
            quotes and account records.
          </li>
          <li>
            <strong>Carriers and logistics partners</strong>, including freight
            carriers, customs brokers and warehouse operators, where needed to
            quote for or carry out a shipment.
          </li>
          <li>
            <strong>Customs, tax and other authorities</strong>, where the law
            requires it or where it is needed to clear and move your goods.
          </li>
          <li>
            <strong>Professional advisers</strong> such as lawyers, auditors
            and insurers, where reasonably necessary.
          </li>
          <li>
            <strong>A buyer or successor</strong> if our business, or part of
            it, is sold, merged or reorganized.
          </li>
          <li>
            <strong>Others where the law requires it</strong>, or where
            disclosure is needed to protect our rights, our customers or the
            public.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "international-transfers",
    title: "International transfers",
    content: (
      <>
        <p>
          We are based in the United States and work with teams, carriers and
          service providers in other countries, including the United Kingdom,
          Ireland and China. Your information may therefore be transferred to,
          and stored or processed in, a country other than your own, where
          data protection laws may differ.
        </p>
        <p>
          Where UK or EU law requires it, we protect these transfers with
          appropriate safeguards, such as standard contractual clauses approved
          by the European Commission or the UK Information Commissioner. You
          can ask us for more information about the safeguards we use.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep your information",
    content: (
      <>
        <p>
          We keep personal information only for as long as we need it for the
          purposes described in this policy:
        </p>
        <ul>
          <li>
            <strong>Enquiries and quote requests</strong> are kept while we
            deal with them and for a reasonable period afterwards, so we can
            follow up and refer back to earlier conversations.
          </li>
          <li>
            <strong>Account, shipping, customs and financial records</strong>{" "}
            are kept for as long as you are a customer and afterwards for the
            period required by customs, tax and accounting laws.
          </li>
        </ul>
        <p>
          When we no longer need information we delete it or make it
          anonymous.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect your information",
    content: (
      <>
        <p>
          We use technical and organizational measures designed to protect
          personal information, including encrypted connections (HTTPS) to
          this website, automated checks on our forms and access controls on
          the systems where we store your information.
        </p>
        <p>
          No website or method of transmission is completely secure, so we
          cannot guarantee absolute security. Please do not send payment card
          details or other highly sensitive information through our forms.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights and choices",
    content: (
      <>
        <p>
          Depending on where you live, you may have the right to:
        </p>
        <ul>
          <li>ask for a copy of the personal information we hold about you;</li>
          <li>ask us to correct information that is inaccurate or incomplete;</li>
          <li>ask us to delete your information;</li>
          <li>ask us to restrict, or object to, how we use your information;</li>
          <li>
            receive the information you gave us in a portable format, or have
            it sent to another organization;
          </li>
          <li>withdraw any consent you have given; and</li>
          <li>opt out of marketing messages at any time.</li>
        </ul>
        <p>
          To use any of these rights, contact us using the details at the end
          of this policy. We may need to confirm your identity before we act
          on a request, and we will reply within the time the law allows. We
          will not treat you less favorably for exercising your rights.
        </p>

        <h3>UK and EEA residents</h3>
        <p>
          You also have the right to complain to your local data protection
          authority, for example the Information Commissioner&rsquo;s Office in
          the UK or the Data Protection Commission in Ireland. We would
          appreciate the chance to resolve your concern first.
        </p>

        <h3>US residents</h3>
        <p>
          Some US states give residents rights to know about, access, correct
          and delete their personal information, and to opt out of its sale or
          use for targeted advertising. We do not sell personal information or
          use it for targeted advertising. You, or an agent you authorize, can
          make a request using the contact details below.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <p>
        This website does not set advertising or analytics cookies. Some
        features provided by third parties, such as the security check on our
        forms and embedded maps, may use cookies or similar technologies. Our{" "}
        <Link href="/cookies">Cookie Policy</Link> explains what these are and
        how to control them.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        Our website and services are intended for businesses and adults. We do
        not knowingly collect personal information from children under 16. If
        you believe a child has given us personal information, please contact
        us and we will delete it.
      </p>
    ),
  },
  {
    id: "other-websites",
    title: "Links to other websites",
    content: (
      <p>
        This website links to other websites, including our brand platforms,
        partner platforms, carriers, Google Maps and social media. We are not
        responsible for the content or privacy practices of websites we do not
        operate, and we encourage you to read their privacy notices.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time, for example when our
        services or the law change. The date at the top of the page shows when
        it was last updated. If we make significant changes we will take
        reasonable steps to let you know, such as posting a notice on this
        website.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>
          If you have a question about this policy, or want to use any of your
          rights, please contact us:
        </p>
        <LegalContactDetails />
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      current="/privacy"
      title="Privacy"
      accent="Policy"
      updated="November 16, 2026"
      intro={
        <p>
          This policy explains what personal information Global American LLC
          collects when you use this website, how we use and share it, and the
          choices and rights you have.
        </p>
      }
      sections={sections}
    />
  );
}
