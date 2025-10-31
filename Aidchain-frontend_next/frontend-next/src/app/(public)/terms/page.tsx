import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By accessing or using AidChain's platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service, including data providers, 
              data consumers, and any third parties accessing datasets through our platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              AidChain is a blockchain-powered platform that facilitates secure, anonymized data sharing and monetization 
              across industries. Our Service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data upload, anonymization, and storage services</li>
              <li>Data marketplace for discovering and accessing datasets</li>
              <li>Blockchain-based verification and transaction recording via Hedera network</li>
              <li>API access for programmatic data interactions</li>
              <li>Analytics and reporting tools</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts and Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">3.1 Account Registration</h4>
            <p>
              You must provide accurate, complete, and current information during registration. You are responsible for 
              safeguarding your account credentials and for all activities under your account.
            </p>
            
            <h4 className="font-semibold">3.2 Data Provider Responsibilities</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ensure you have legal rights to share uploaded data</li>
              <li>Obtain necessary consents and authorizations before data upload</li>
              <li>Comply with applicable data protection laws (GDPR, CCPA, etc.)</li>
              <li>Provide accurate metadata and dataset descriptions</li>
              <li>Not upload malicious, corrupted, or illegal content</li>
            </ul>

            <h4 className="font-semibold">3.3 Data Consumer Responsibilities</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use datasets only for stated and lawful purposes</li>
              <li>Comply with dataset-specific usage terms and restrictions</li>
              <li>Not attempt to re-identify anonymized individuals</li>
              <li>Respect intellectual property rights</li>
              <li>Report any data quality or compliance issues</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Data Processing and International Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">4.1 Cross-Border Data Transfers</h4>
            <p>
              Our Service operates globally and may involve transferring data across international borders. 
              We implement appropriate safeguards including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Standard Contractual Clauses (SCCs) for EU data transfers</li>
              <li>Adequacy decisions where applicable</li>
              <li>Binding Corporate Rules for intra-group transfers</li>
              <li>Certification schemes and codes of conduct</li>
            </ul>

            <h4 className="font-semibold">4.2 Data Localization Compliance</h4>
            <p>
              We respect data localization requirements and provide options for region-specific data storage 
              where required by local laws, including but not limited to Russia, China, and other jurisdictions 
              with data residency requirements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Blockchain and Hedera Network</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our Service utilizes the Hedera blockchain network for transaction verification and immutable record-keeping. 
              By using our Service, you acknowledge:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Blockchain transactions are irreversible once confirmed</li>
              <li>Transaction records are publicly visible on the Hedera network</li>
              <li>We cannot control Hedera network performance or availability</li>
              <li>Network fees may apply for blockchain transactions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">6.1 Platform Rights</h4>
            <p>
              AidChain retains all rights to the platform, including software, algorithms, and anonymization technologies. 
              Users receive a limited, non-exclusive license to use the Service.
            </p>

            <h4 className="font-semibold">6.2 Dataset Rights</h4>
            <p>
              Data providers retain ownership of their original datasets. By uploading data, providers grant AidChain 
              and authorized users specific usage rights as defined in dataset-specific licenses.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Compliance and Regulatory Framework</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">7.1 International Compliance</h4>
            <p>Our Service complies with major international frameworks:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>GDPR</strong> (EU General Data Protection Regulation)</li>
              <li><strong>CCPA</strong> (California Consumer Privacy Act)</li>
              <li><strong>PIPEDA</strong> (Personal Information Protection and Electronic Documents Act - Canada)</li>
              <li><strong>LGPD</strong> (Lei Geral de Proteção de Dados - Brazil)</li>
              <li><strong>PDPA</strong> (Personal Data Protection Act - Singapore, Thailand)</li>
              <li><strong>Privacy Act 1988</strong> (Australia)</li>
            </ul>

            <h4 className="font-semibold">7.2 Sector-Specific Regulations</h4>
            <p>For healthcare data, we comply with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>HIPAA</strong> (Health Insurance Portability and Accountability Act - US)</li>
              <li><strong>FDA</strong> regulations for clinical data</li>
              <li><strong>EMA</strong> guidelines (European Medicines Agency)</li>
              <li><strong>ICH GCP</strong> (Good Clinical Practice)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Prohibited Uses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You may not use our Service to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Upload malicious software or harmful content</li>
              <li>Attempt to reverse-engineer anonymization processes</li>
              <li>Engage in unauthorized data mining or scraping</li>
              <li>Circumvent security measures or access controls</li>
              <li>Share datasets containing illegal content</li>
              <li>Attempt to re-identify anonymized individuals</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To the maximum extent permitted by law, AidChain shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including but not limited to loss of profits, data, 
              use, goodwill, or other intangible losses.
            </p>
            <p>
              Our total liability for any claims arising from these Terms or the Service shall not exceed 
              the amount paid by you to AidChain in the twelve months preceding the claim.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">10.1 Governing Law</h4>
            <p>
              These Terms are governed by the laws of [Jurisdiction], without regard to conflict of law principles.
            </p>

            <h4 className="font-semibold">10.2 International Arbitration</h4>
            <p>
              For international disputes, parties agree to binding arbitration under the ICC Rules of Arbitration, 
              with proceedings conducted in English in [City, Country].
            </p>

            <h4 className="font-semibold">10.3 Local Jurisdiction</h4>
            <p>
              Users may also pursue claims in their local jurisdiction where permitted by applicable consumer protection laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice, 
              for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
            <p>
              Upon termination, your right to use the Service will cease immediately. Data deletion will be handled 
              according to our Privacy Policy and applicable data retention requirements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material changes 
              via email or platform notification at least 30 days before the effective date.
            </p>
            <p>
              Continued use of the Service after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 space-y-1">
              <p><strong>Email:</strong> legal@aidchain.com</p>
              <p><strong>Address:</strong> [Company Address]</p>
              <p><strong>Data Protection Officer:</strong> dpo@aidchain.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}