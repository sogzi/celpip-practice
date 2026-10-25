import type { Metadata } from "next";
import { ContactLink, LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy · ${SITE.name}`,
  description: `How ${SITE.name} collects, uses and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <p>
          {SITE.name} ({SITE.url}) is a practice tool for the CELPIP-General English test, run by {SITE.operator}. This policy
          explains what information we collect when you use {SITE.name}, how we use it, and the choices you have. If you have any
          questions, contact us at <ContactLink />.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <b>Account information.</b> When you sign up with an email address and password, we store your email address and a
            securely hashed version of your password (we never see or store your actual password). When you sign in with Google, we
            receive your name, email address and profile picture from your Google account.
          </li>
          <li>
            <b>Profile information</b> you choose to add, such as your display name and target CELPIP level.
          </li>
          <li>
            <b>Practice history.</b> Your results for each practice task and test, including your answers, the text of your writing
            responses, the text transcripts of your speaking responses and the feedback you received, so you can review them and
            track your progress on any device.
          </li>
          <li>
            <b>Basic technical information</b> needed to run the service securely, such as sign-in session cookies and server logs
            (for example, IP address, browser type and the time of a request).
          </li>
          <li>
            <b>Anonymous usage statistics.</b> We use Vercel Web Analytics to count page views and see which pages are used, along
            with general information such as country, device type and browser. It does not use cookies and does not identify you
            personally.
          </li>
        </ul>
        <p>
          <b>Voice recordings stay on your device.</b> When you practise speaking, your audio is recorded in your browser so you can
          play it back; we do not upload or store the audio. Live transcription uses your browser&apos;s built-in speech recognition,
          which, depending on your browser, may be processed by your browser provider (for example, Google for Chrome or Apple for
          Safari) under their own privacy policies.
        </p>
      </section>

      <section>
        <h2>How we use your information</h2>
        <ul>
          <li>To create and secure your account and let you sign in.</li>
          <li>To score your writing and speaking practice and show you feedback.</li>
          <li>To save your profile and track your progress.</li>
          <li>To respond to your messages and provide support.</li>
          <li>To keep the service secure and prevent abuse, such as limiting excessive use.</li>
        </ul>
        <p>We do not sell your personal information, and we do not use it for advertising.</p>
      </section>

      <section>
        <h2>Information from Google</h2>
        <p>
          If you choose &quot;Continue with Google&quot;, we request only your basic profile information (name, email address and
          profile picture) to create your account and sign you in. We do not access your Gmail messages, contacts, files or any
          other Google data.
        </p>
        <p>
          {SITE.name}&apos;s use and transfer of information received from Google APIs will adhere to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. We do not use Google user data for advertising, we do not sell it, and we do
          not use it to develop or train AI models.
        </p>
      </section>

      <section>
        <h2>Service providers we share information with</h2>
        <p>We use a small number of trusted providers to run {SITE.name}. They process information only on our behalf:</p>
        <ul>
          <li>
            <b>Supabase</b>: stores accounts, profiles and practice history, and handles sign-in.
          </li>
          <li>
            <b>Vercel</b>: hosts the website and processes requests.
          </li>
          <li>
            <b>Anthropic</b>: receives the text of your writing responses and speaking transcripts to generate scores and
            feedback. We do not send your name or email address with your answers. Under Anthropic&apos;s commercial terms, this
            data is not used to train their models.
          </li>
          <li>
            <b>Google</b>: only if you choose to sign in with Google.
          </li>
        </ul>
        <p>We may also disclose information if required by law or to protect the rights and safety of our users or others.</p>
      </section>

      <section>
        <h2>Cookies and local storage</h2>
        <p>
          We use essential cookies to keep you signed in. We also keep some settings and a copy of your recent practice history in
          your browser&apos;s local storage so pages load quickly (for example, your light or dark mode choice). We do not use
          advertising or third-party tracking cookies, and our usage statistics work without cookies.
        </p>
      </section>

      <section>
        <h2>How long we keep information</h2>
        <p>
          We keep your account and profile while your account is active. If you delete your account, we delete your account and
          profile information within 30 days, except where we must keep limited records to meet legal obligations. Server logs are
          kept for a short period for security purposes.
        </p>
      </section>

      <section>
        <h2>Your choices and rights</h2>
        <ul>
          <li>You can view and update your profile at any time, and delete individual results from your practice history.</li>
          <li>
            You can ask for a copy of your information, ask us to correct it, or ask us to delete your account by emailing{" "}
            <ContactLink />.
          </li>
          <li>
            If you signed in with Google, you can also remove {SITE.name}&apos;s access at any time from your{" "}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
              Google Account permissions
            </a>
            .
          </li>
        </ul>
        <p>
          Depending on where you live (for example, under Canada&apos;s PIPEDA or the EU/UK GDPR), you may have additional rights. We
          will respond to requests within 30 days.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          We use industry-standard measures to protect your information, including encrypted connections (HTTPS), hashed
          passwords and access controls that ensure each user can only access their own profile. No online service can be
          completely secure, so please use a strong, unique password.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          {SITE.name} is not directed to children under 13, and we do not knowingly collect information from them. If you believe a
          child has given us information, please contact us and we will delete it.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. We will change the &quot;Last updated&quot; date above and, for significant
          changes, let you know through the service or by email.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions or requests about your privacy: <ContactLink />.
        </p>
      </section>
    </LegalPage>
  );
}
