import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              AidChain ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal data. 
              This Privacy Policy explains how we collect, use, process, and protect your information when you use our data sharing platform.
            </p>
            <p>
              This policy applies to all users of our Service, including data providers, data consumers, and visitors to our platform, 
              regardless of their geographic location.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Legal Basis and International Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">2.1 GDPR Compliance (EU/EEA Users)</h4>
            <p>For users in the European Union and European Economic Area, we process personal data based on:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Consent:</strong> When you explicitly agree to data processing</li>
              <li><strong>Contract:</strong> To provide our services and fulfill our obligations</li>
              <li><strong>Legitimate Interest:</strong> For platform security, fraud prevention, and service improvement</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            </ul>

            <h4 className="font-semibold">2.2 Global Privacy Framework</h4>
            <p>We comply with privacy laws worldwide, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>CCPA (California Consumer Privacy Act)</li>
              <li>PIPEDA (Canada)</li>
              <li>LGPD (Brazil)</li>
              <li>PDPA (Singapore, Thailand)</li>
              <li>Privacy Act 1988 (Australia)</li>
              <li>POPI Act (South Africa)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">3.1 Personal Information</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, organization, role/title</li>
              <li><strong>Contact Details:</strong> Phone number, business address (optional)</li>
              <li><strong>Authentication Data:</strong> Password hashes, two-factor authentication tokens</li>
              <li><strong>Payment Information:</strong> Billing details, transaction history (processed by third-party providers)</li>
            </ul>

            <h4 className="font-semibold">3.2 Technical Information</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Usage Data:</strong> Platform interactions, feature usage, session duration</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>API Usage:</strong> API calls, access patterns, performance metrics</li>
              <li><strong>Blockchain Data:</strong> Transaction hashes, timestamps (publicly visible on Hedera network)</li>
            </ul>

            <h4 className="font-semibold">3.3 Dataset Metadata</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dataset Information:</strong> Titles, descriptions, categories, tags</li>
              <li><strong>Usage Metrics:</strong> Download counts, access requests, ratings</li>
              <li><strong>Provenance Data:</strong> Upload timestamps, modification history</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">4.1 Service Provision</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account creation and management</li>
              <li>Dataset upload, processing, and anonymization</li>
              <li>Facilitating data transactions and access requests</li>
              <li>Providing customer support and technical assistance</li>
              <li>Processing payments and managing subscriptions</li>
            </ul>

            <h4 className="font-semibold">4.2 Platform Security and Integrity</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fraud detection and prevention</li>
              <li>Security monitoring and incident response</li>
              <li>Compliance monitoring and audit trails</li>
              <li>Data quality assurance and validation</li>
            </ul>

            <h4 className="font-semibold">4.3 Service Improvement</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Analytics and usage pattern analysis</li>
              <li>Feature development and optimization</li>
              <li>Performance monitoring and troubleshooting</li>
              <li>Research and development (anonymized data only)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Data Anonymization and Processing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">5.1 Anonymization Techniques</h4>
            <p>We employ state-of-the-art anonymization methods:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>K-anonymity:</strong> Ensuring groups of at least k individuals share identifying attributes</li>
              <li><strong>L-diversity:</strong> Maintaining diversity in sensitive attributes</li>
              <li><strong>Differential Privacy:</strong> Adding mathematical noise to prevent individual identification</li>
              <li><strong>Data Masking:</strong> Replacing sensitive values with realistic but fictional data</li>
              <li><strong>Generalization:</strong> Reducing precision of identifying attributes</li>
            </ul>

            <h4 className="font-semibold">5.2 Re-identification Prevention</h4>
            <p>
              We implement multiple safeguards to prevent re-identification of anonymized data, including 
              regular risk assessments, technical controls, and contractual obligations for data consumers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">6.1 Cross-Border Processing</h4>
            <p>
              Our global platform may process data across multiple jurisdictions. We ensure adequate protection through:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate protection levels</li>
              <li><strong>Standard Contractual Clauses:</strong> EU-approved transfer mechanisms</li>
              <li><strong>Binding Corporate Rules:</strong> Internal data protection standards</li>
              <li><strong>Certification Schemes:</strong> Industry-recognized privacy certifications</li>
            </ul>

            <h4 className="font-semibold">6.2 Data Localization</h4>
            <p>
              Where required by local laws, we provide data residency options to ensure compliance with 
              jurisdictional requirements, including Russia's Federal Law 242-FZ, China's Cybersecurity Law, 
              and other national data localization mandates.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">7.1 Authorized Sharing</h4>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Service Providers:</strong> Cloud hosting, payment processing, analytics (under strict contracts)</li>
              <li><strong>Business Partners:</strong> Integration partners and certified data processors</li>
              <li><strong>Hedera Network:</strong> Transaction metadata (publicly visible on blockchain)</li>
            </ul>

            <h4 className="font-semibold">7.2 Legal Disclosure</h4>
            <p>We may disclose information when required by law or to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Comply with legal obligations and court orders</li>
              <li>Protect our rights, property, or safety</li>
              <li>Investigate fraud or security incidents</li>
              <li>Enforce our Terms of Service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">8.1 Universal Rights</h4>
            <p>Regardless of location, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Access:</strong> Request copies of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request removal of your personal data (subject to legal obligations)</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
            </ul>

            <h4 className="font-semibold">8.2 Enhanced Rights (GDPR/CCPA)</h4>
            <p>EU/EEA and California residents have additional rights:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Restriction:</strong> Limit processing of your personal data</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Revoke previously given consent</li>
              <li><strong>Lodge Complaints:</strong> File complaints with supervisory authorities</li>
            </ul>

            <h4 className="font-semibold">8.3 Exercising Your Rights</h4>
            <p>
              To exercise your rights, contact us at privacy@aidchain.com. We will respond within the timeframes 
              required by applicable law (typically 30 days for GDPR, 45 days for CCPA).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">9.1 Technical Safeguards</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Encryption:</strong> AES-256 encryption at rest and TLS 1.3 in transit</li>
              <li><strong>Access Controls:</strong> Role-based permissions and multi-factor authentication</li>
              <li><strong>Network Security:</strong> Firewalls, intrusion detection, and DDoS protection</li>
              <li><strong>Blockchain Security:</strong> Immutable transaction records on Hedera network</li>
            </ul>

            <h4 className="font-semibold">9.2 Organizational Measures</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Regular security audits and penetration testing</li>
              <li>Employee training and background checks</li>
              <li>Incident response and breach notification procedures</li>
              <li>Data minimization and retention policies</li>
            </ul>

            <h4 className="font-semibold">9.3 Certifications and Standards</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>ISO 27001 Information Security Management</li>
              <li>SOC 2 Type II compliance</li>
              <li>HIPAA compliance for healthcare data</li>
              <li>Regular third-party security assessments</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">10.1 Retention Periods</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account Data:</strong> Retained while account is active plus 7 years for legal compliance</li>
              <li><strong>Transaction Records:</strong> 10 years for financial and audit requirements</li>
              <li><strong>Usage Logs:</strong> 2 years for security and analytics purposes</li>
              <li><strong>Blockchain Records:</strong> Permanent (immutable nature of blockchain)</li>
            </ul>

            <h4 className="font-semibold">10.2 Deletion Procedures</h4>
            <p>
              Upon account deletion or data retention expiry, we securely delete personal data using 
              industry-standard methods, except where retention is required by law or legitimate interests.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">11.1 Cookie Usage</h4>
            <p>We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Essential:</strong> Authentication, security, and core functionality</li>
              <li><strong>Analytics:</strong> Usage statistics and performance monitoring (anonymized)</li>
              <li><strong>Preferences:</strong> User settings and customization</li>
            </ul>

            <h4 className="font-semibold">11.2 Cookie Management</h4>
            <p>
              You can control cookies through your browser settings or our cookie preference center. 
              Note that disabling essential cookies may affect platform functionality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our Service is not intended for individuals under 16 years of age (or the applicable age of digital consent 
              in your jurisdiction). We do not knowingly collect personal information from children. If we become aware 
              that we have collected personal data from a child, we will take steps to delete such information promptly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices, technology, 
              legal requirements, or other factors. We will notify you of material changes via email or 
              platform notification at least 30 days before the effective date.
            </p>
            <p>
              We encourage you to review this policy regularly to stay informed about how we protect your privacy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>14. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For privacy-related questions, concerns, or to exercise your rights, please contact us:
            </p>
            <div className="mt-4 space-y-2">
              <p><strong>Privacy Team:</strong> privacy@aidchain.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@aidchain.com</p>
              <p><strong>Address:</strong> [Company Address]</p>
              <p><strong>Phone:</strong> [Phone Number]</p>
            </div>

            <h4 className="font-semibold mt-6">Regional Representatives</h4>
            <div className="space-y-2">
              <p><strong>EU Representative:</strong> eu-rep@aidchain.com</p>
              <p><strong>UK Representative:</strong> uk-rep@aidchain.com</p>
              <p><strong>Brazil Representative:</strong> br-rep@aidchain.com</p>
            </div>

            <h4 className="font-semibold mt-6">Supervisory Authorities</h4>
            <p>
              EU/EEA residents may lodge complaints with their local data protection authority. 
              A list of authorities is available at: https://edpb.europa.eu/about-edpb/board/members_en
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}