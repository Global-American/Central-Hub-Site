import Link from "next/link";
import LegalPage, {
  LegalContactDetails,
  type LegalSection,
} from "@/components/legal-page";

export const metadata = {
  title: "Terms of Service - Global American LLC",
  description:
    "The terms that apply when you use the Global American LLC website, request a quote or apply for an account.",
};

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Agreeing to these terms",
    content: (
      <>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) apply to your use of
          this website, which is operated by Global American LLC
          (&ldquo;Global American&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or
          &ldquo;our&rdquo;). By using the website you agree to these Terms. If
          you do not agree, please do not use the website.
        </p>
        <p>
          If you use the website on behalf of a business, you confirm that you
          are authorized to accept these Terms for that business, and
          &ldquo;you&rdquo; means both you and the business.
        </p>
      </>
    ),
  },
  {
    id: "about-this-website",
    title: "About this website",
    content: (
      <p>
        This website describes the shipping, freight, returns and fulfillment
        services we offer through our Ship itSmart, Freight itSmart, Return
        itSmart and Fulfill itSmart brands, and lets you contact us, request a
        quote and apply for an account. It is intended for businesses and for
        individuals aged 18 or over.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Using the website",
    content: (
      <>
        <p>
          You may use the website for lawful purposes connected with learning
          about or arranging our services. You agree not to:
        </p>
        <ul>
          <li>use the website in any way that breaks a law or regulation;</li>
          <li>
            submit information that is false, misleading or that you have no
            right to share;
          </li>
          <li>
            send spam, or use the forms for anything other than a genuine
            enquiry, quote request or account application;
          </li>
          <li>
            bypass, disable or interfere with the security checks or other
            security features of the website;
          </li>
          <li>
            use robots, scrapers or other automated tools to access or copy the
            website without our written permission;
          </li>
          <li>
            introduce viruses or other harmful code, or attempt to gain
            unauthorized access to the website or the systems behind it; or
          </li>
          <li>
            impersonate another person or business, or misrepresent your
            connection with one.
          </li>
        </ul>
        <p>
          We may suspend or block access to the website for anyone who breaches
          these Terms.
        </p>
      </>
    ),
  },
  {
    id: "quotes-and-applications",
    title: "Quotes, enquiries and account applications",
    content: (
      <>
        <ul>
          <li>
            <strong>Quote requests are not bookings.</strong> Submitting a
            quote request asks us to prepare a price. It does not create a
            contract and does not oblige either of us to go ahead.
          </li>
          <li>
            <strong>Quotes are estimates.</strong> Any quote we give is based
            on the information you provide and is subject to our confirmation,
            carrier availability, and any applicable surcharges, duties, taxes
            and fees. The final price may change if the actual shipment differs
            from what you described, for example in size, weight, contents or
            destination.
          </li>
          <li>
            <strong>Accurate information is your responsibility.</strong> You
            must describe your shipment truthfully and completely, including
            its contents, value and whether it contains dangerous goods, and
            give accurate customs and tax details.
          </li>
          <li>
            <strong>Account applications need our approval.</strong> We review
            every application, may ask for more information, and may decline an
            application or set conditions on an account at our discretion.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "service-terms",
    title: "Our services and separate agreements",
    content: (
      <>
        <p>
          These Terms cover your use of this website only. The shipping,
          freight, returns and fulfillment services themselves are provided
          under separate terms, which may include your account or service
          agreement with us, the terms shown on the relevant brand platform,
          and the conditions of carriage of the carrier that moves your goods.
        </p>
        <p>
          If those service terms conflict with these Terms in relation to a
          service, the service terms apply.
        </p>
      </>
    ),
  },
  {
    id: "third-party-sites",
    title: "Brand platforms and other websites",
    content: (
      <p>
        The website links to other websites and services, including our brand
        platforms, partner platforms such as label generation tools, Google
        Maps and social media. Those sites have their own terms and privacy
        notices, which apply when you use them. We provide links for
        convenience and are not responsible for websites we do not operate.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <>
        <p>
          The website and everything on it, including text, graphics, logos,
          images, animations and software, belongs to Global American or its
          licensors and is protected by copyright, trademark and other laws.
          Global American, Ship itSmart, Freight itSmart, Return itSmart and
          Fulfill itSmart, and their logos, are our trademarks. Other names
          and logos, including those of carriers, belong to their owners.
        </p>
        <p>
          You may view the website and print or download pages for your own
          internal business use. You may not otherwise copy, modify,
          distribute or reuse any part of it, or use our trademarks, without
          our written permission.
        </p>
      </>
    ),
  },
  {
    id: "your-submissions",
    title: "Information you send us",
    content: (
      <>
        <p>
          You are responsible for the information you submit through the
          website. You confirm that you have the right to share it, including
          any information about other people, and you allow us to use it to
          respond to you and to provide our services.
        </p>
        <p>
          We handle personal information as described in our{" "}
          <Link href="/privacy">Privacy Policy</Link>. Our use of cookies is
          explained in our <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "website-content",
    title: "Website content",
    content: (
      <>
        <p>
          We try to keep the website accurate and up to date, but service
          descriptions, carrier options, coverage and transit information are
          general guidance only and may change without notice.
        </p>
        <p>
          Nothing on the website is legal, customs, tax or other professional
          advice. You are responsible for making sure your shipments comply
          with the import, export and other laws that apply to them.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: (
      <p>
        The website is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo;. To the fullest extent permitted by law, we disclaim
        all warranties, whether express or implied, including implied
        warranties of merchantability, fitness for a particular purpose and
        non-infringement. We do not promise that the website will always be
        available, uninterrupted, secure or free of errors.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by law, Global American and its
          affiliates, officers, employees and agents will not be liable for
          any indirect, incidental, special, consequential or punitive
          damages, or for any loss of profits, revenue, business, data or
          goodwill, arising from your use of, or inability to use, the
          website.
        </p>
        <p>
          Our liability for the services we provide is governed by the
          separate service terms described above, not by these Terms.
        </p>
        <p>
          Nothing in these Terms excludes or limits any liability that cannot
          be excluded or limited by law, and nothing affects the rights you
          have as a consumer under the laws of the country where you live.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    content: (
      <p>
        To the extent permitted by law, you agree to compensate us for any
        claims, losses and reasonable costs we incur because you breached
        these Terms, misused the website, or submitted information that was
        inaccurate or that you had no right to share.
      </p>
    ),
  },
  {
    id: "availability",
    title: "Changes to the website",
    content: (
      <p>
        We may change, suspend or withdraw all or part of the website at any
        time and without notice. We are not liable if the website is
        unavailable for any period.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    content: (
      <>
        <p>
          These Terms are governed by the laws of the State of New Jersey,
          USA, without regard to its conflict of laws rules. Any dispute about
          these Terms or the website will be heard in the state or federal
          courts located in New Jersey, and you and we agree to the
          jurisdiction of those courts.
        </p>
        <p>
          If you are a consumer living outside the United States, you may also
          have the benefit of mandatory protections under the law of your
          country, and nothing in this section takes those away.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    content: (
      <p>
        We may update these Terms from time to time. The date at the top of
        the page shows when they were last updated. The updated Terms apply
        from the date they are posted, and by continuing to use the website
        after that date you accept them.
      </p>
    ),
  },
  {
    id: "general",
    title: "General",
    content: (
      <ul>
        <li>
          If any part of these Terms is found to be unenforceable, the rest
          continues to apply.
        </li>
        <li>
          If we do not enforce a right under these Terms, that is not a waiver
          of it.
        </li>
        <li>
          These Terms, together with our Privacy Policy and Cookie Policy, are
          the whole agreement between you and us about your use of the
          website.
        </li>
        <li>
          You may not transfer your rights under these Terms without our
          consent. We may transfer ours to a successor or affiliate.
        </li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>If you have a question about these Terms, please contact us:</p>
        <LegalContactDetails />
      </>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      current="/terms"
      title="Terms of"
      accent="Service"
      updated="November 16, 2026"
      intro={
        <p>
          These terms set out the rules for using the Global American LLC
          website, including the contact form, quote requests and account
          applications. Please read them before you use the website.
        </p>
      }
      sections={sections}
    />
  );
}
