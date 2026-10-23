import type { Metadata } from "next";
import Link from "next/link";
import { ContactLink, LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of Service · ${SITE.name}`,
  description: `The terms that apply when you use ${SITE.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <section>
        <p>
          These Terms of Service (&quot;Terms&quot;) apply to your use of {SITE.name} ({SITE.url}), a practice tool for the
          CELPIP-General English test run by {SITE.operator} (&quot;we&quot;, &quot;us&quot;). By creating an account or using{" "}
          {SITE.name}, you agree to these Terms and to our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please do
          not use the service.
        </p>
      </section>

      <section>
        <h2>The service</h2>
        <p>
          {SITE.name} provides practice tests and AI-generated scores and feedback for reading, listening, writing and speaking. It
          is an independent study aid. {SITE.name} is <b>not affiliated with, endorsed by or connected to</b> Paragon Testing
          Enterprises or the official CELPIP test. CELPIP is a trademark of its respective owner.
        </p>
      </section>

      <section>
        <h2>Scores are estimates</h2>
        <p>
          Scores, levels and feedback in {SITE.name} are generated automatically, partly using artificial intelligence. They are
          estimates for practice only and may be inaccurate. They are not official CELPIP results and do not predict or guarantee
          any result on the real test or any immigration, study or employment outcome. Do not rely on them for official purposes.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <ul>
          <li>You must be at least 13 years old to use {SITE.name}.</li>
          <li>Provide accurate information when you sign up and keep your password secure.</li>
          <li>You are responsible for activity on your account. Tell us promptly if you think it has been accessed without permission.</li>
          <li>One person per account; please don&apos;t share accounts.</li>
        </ul>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the service for anything unlawful, harmful or abusive.</li>
          <li>Use bots, scripts or other automated means to access the service or to submit content.</li>
          <li>Try to get around usage limits, security features or access controls.</li>
          <li>Interfere with or overload the service, or try to access other users&apos; information.</li>
          <li>Copy, resell or redistribute the service or its content without our permission.</li>
          <li>Submit content that infringes others&apos; rights or contains offensive or illegal material.</li>
        </ul>
        <p>We may set reasonable usage limits, for example on how many answers can be scored per day.</p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          You own the answers you submit. You give us permission to store and process them, including sending them to our AI
          provider, solely to provide the service to you, such as scoring your answers and showing your feedback and history.
        </p>
      </section>

      <section>
        <h2>Our content</h2>
        <p>
          The {SITE.name} website, practice questions, design and software are owned by us or our licensors. You may use them for
          your own personal, non-commercial study.
        </p>
      </section>

      <section>
        <h2>Availability and changes</h2>
        <p>
          We are continually improving {SITE.name} and may add, change or remove features at any time. The service is offered
          during a testing period and may be interrupted or unavailable at times. We may suspend or end the service, or your access
          to it, if you break these Terms or if we need to for legal, security or operational reasons.
        </p>
      </section>

      <section>
        <h2>Ending your account</h2>
        <p>
          You can stop using {SITE.name} at any time and ask us to delete your account by emailing <ContactLink />.
        </p>
      </section>

      <section>
        <h2>Disclaimer</h2>
        <p>
          {SITE.name} is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind, whether express or
          implied, including warranties of accuracy, fitness for a particular purpose and non-infringement, to the fullest extent
          permitted by law.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for any indirect, incidental, special or consequential
          damages, or for any loss of data, opportunity or results (including test results), arising from your use of{" "}
          {SITE.name}. Some jurisdictions do not allow certain limitations, so some of these may not apply to you.
        </p>
      </section>

      <section>
        <h2>Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. We will change the &quot;Last updated&quot; date above and, for significant
          changes, let you know through the service or by email. If you keep using {SITE.name} after changes take effect, you accept
          the updated Terms.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these Terms: <ContactLink />.
        </p>
      </section>
    </LegalPage>
  );
}
