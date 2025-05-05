
import { Shield, Mail, FileText, BookOpen, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-6">Effective Date: {today}</p>
      
      <div className="bg-slate-50 dark:bg-slate-900 p-4 mb-8 rounded-md border border-slate-200 dark:border-slate-800">
        <p className="font-bold mb-4">THIS IS A LEGALLY BINDING AGREEMENT BETWEEN YOU (THE USER) AND OPEN SOCIALS LTD. BY ACCESSING, BROWSING, REGISTERING FOR, OR USING THE PLATFORM IN ANY MANNER, YOU AGREE TO BE FULLY AND UNCONDITIONALLY BOUND BY THESE TERMS. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THE PLATFORM.</p>
        
        <p className="text-sm">
          This Agreement is enforceable in the United Kingdom, United Arab Emirates (including DIFC and ADGM jurisdictions), and globally, under applicable international digital commerce and privacy laws, including the UK Data Protection Act 2018, GDPR, COPPA, and UAE Federal Decree Law No. 45 of 2021 on the Protection of Personal Data.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. DEFINITIONS</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>1.1 "Platform" means all websites, software, infrastructure, systems, APIs, and services owned or operated by Open Socials Ltd. that enable Brands and Creators to execute paid sponsorship campaigns.</p>
          <p>1.2 "User" refers to any individual, entity, Brand, or Creator that accesses, uses, or interacts with the Platform.</p>
          <p>1.3 "Brand" means any User that initiates or funds a sponsorship or marketing campaign.</p>
          <p>1.4 "Creator" means any User that provides digital content, services, or campaign deliverables via the Platform.</p>
          <p>1.5 "Campaign" means a transaction or arrangement facilitated by the Platform between a Brand and a Creator.</p>
          <p>1.6 "Parent/Guardian" refers to a legally responsible adult accountable for a User under the age of 18.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. LEGAL BINDING USE</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>2.1 Use of the Platform in any form, including browsing, constitutes full and binding acceptance of these Terms.</p>
          <p>2.2 These Terms apply globally and are enforceable under UK and UAE law, including DIFC and ADGM standards, and international digital contract norms.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. ELIGIBILITY AND ACCOUNT RESPONSIBILITY</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>3.1 Users must be 18 years of age or older. Minors may only access the Platform with the active, verifiable, and legal consent of a Parent/Guardian.</p>
          <p>3.2 The Parent/Guardian assumes full legal responsibility, risk, liability, and indemnity for any actions of the underage User.</p>
          <p>3.3 Open Socials reserves the right to request identity or age verification at any time.</p>
          <p>3.4 Users are solely responsible for maintaining the accuracy, security, and confidentiality of their account. Open Socials is not liable for unauthorized access or misuse.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. CAMPAIGN CONTRACTS AND EXECUTION</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>4.1 Upon acceptance of a Campaign, a binding and enforceable digital contract is formed between Brand and Creator.</p>
          <p>4.2 All Campaign deliverables, communication, and disputes must be managed through the Platform.</p>
          <p>4.3 Open Socials is not a party to these contracts and assumes no liability or obligation for their enforcement, execution, or result.</p>
          <p>4.4 Users agree that failure to perform obligations within agreed timelines and specifications may result in penalties, withholding of payment, legal enforcement by the counterparty, and/or account termination.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. PAYMENTS, FEES, TAXES, AND REFUNDS</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>5.1 All transactions must be executed through the Platform's payment system.</p>
          <p>5.2 Open Socials deducts platform fees and commissions as published. All such fees are non-refundable.</p>
          <p>5.3 Users are solely responsible for compliance with tax laws and reporting in their jurisdiction.</p>
          <p>5.4 Open Socials is not responsible for failed payments, chargebacks, fraudulent activity, or third-party processor errors.</p>
          <p>5.5 Refunds, if granted, are solely at Open Socials' discretion and not subject to appeal.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. PLATFORM ACCESS AND PERFORMANCE</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>6.1 The Platform is provided strictly "as-is" and "as-available" with no warranties of any kind.</p>
          <p>6.2 Open Socials disclaims all express, implied, and statutory warranties including but not limited to reliability, uptime, security, merchantability, or fitness for a particular purpose.</p>
          <p>6.3 Platform downtime, errors, or performance issues create no liability, refund rights, or claims against Open Socials.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. CONTENT AND INTELLECTUAL PROPERTY</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>7.1 Users retain ownership of original content uploaded to the Platform, but grant Open Socials and applicable Brands a royalty-free, worldwide, non-exclusive license to use such content for campaign execution.</p>
          <p>7.2 Users must not upload content they do not have full legal rights to. Infringing material will be removed and may result in account termination.</p>
          <p>7.3 Open Socials retains full ownership of all Platform software, data, interfaces, content, and systems. Users may not copy, reverse-engineer, or replicate any portion of the Platform.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. DATA PROTECTION AND CONFIDENTIALITY</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>8.1 Open Socials collects and processes data in accordance with the UK Data Protection Act 2018, GDPR, UAE Data Protection Law, and applicable global privacy regulations.</p>
          <p>8.2 By using the Platform, Users consent to the collection, processing, storage, and international transfer of their data.</p>
          <p>8.3 Campaign-related and business communications are confidential. Users may not disclose confidential material without express written permission.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. PROHIBITED USE AND ENFORCEMENT</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>9.1 Users must not:</p>
          <ul className="list-disc pl-8 space-y-1">
            <li>Violate any applicable law or regulation;</li>
            <li>Submit fraudulent, misleading, or illegal content;</li>
            <li>Circumvent payment systems or solicit off-platform transactions;</li>
            <li>Exploit, harass, or abuse other Users;</li>
            <li>Attempt to compromise Platform security or integrity.</li>
          </ul>
          <p>9.2 Open Socials reserves the right to investigate, suspend, or terminate any account at its sole discretion.</p>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. INDEMNITY, LIABILITY WAIVER, AND LEGAL RISK ALLOCATION</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>10.1 Users agree to fully indemnify, defend, and hold harmless Open Socials, its affiliates, officers, directors, employees, contractors, and agents against all claims, liabilities, losses, damages, legal costs, and third-party actions resulting from:</p>
          <ul className="list-disc pl-8 space-y-1">
            <li>Use or misuse of the Platform;</li>
            <li>Participation in Campaigns;</li>
            <li>Breach of contract or violation of law;</li>
            <li>IP or content disputes;</li>
            <li>Tax or financial reporting failures;</li>
            <li>Regulatory investigations.</li>
          </ul>
          <p>10.2 Open Socials assumes zero liability under any condition. Users accept full and unconditional responsibility for all legal, financial, and reputational risks.</p>
          <p>10.3 Users expressly waive the right to initiate or join any lawsuit, arbitration, claim, or demand for damages, refunds, or injunctive relief against Open Socials in any jurisdiction.</p>
          <p>10.4 Open Socials shall not be held liable under any circumstance, even where laws may seek to impose limitations. Users agree that Open Socials has no financial, legal, or operational obligation to them under any law or regulation, and hereby waive any such claim in advance.</p>
          <p>10.5 Platform is used entirely at the User's own risk.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">11. TERMINATION</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>11.1 Open Socials may suspend or permanently terminate any account at any time, for any reason, without notice.</p>
          <p>11.2 Termination does not affect Open Socials' right to pursue indemnity, legal remedies, or enforcement of prior obligations.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">12. MODIFICATIONS</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>12.1 Open Socials may modify these Terms at any time. Updated versions will be posted publicly.</p>
          <p>12.2 Continued use of the Platform after any change constitutes automatic acceptance of the revised Terms.</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">13. GOVERNING LAW AND DISPUTE RESOLUTION</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>13.1 These Terms shall be governed by the laws of England and Wales and the applicable commercial laws of the United Arab Emirates.</p>
          <p>13.2 All disputes shall first be submitted to confidential mediation. If unresolved, the matter shall be referred to binding arbitration:</p>
          <ul className="list-disc pl-8 space-y-1">
            <li>Under the London Court of International Arbitration (LCIA) Rules for Users domiciled in the UK;</li>
            <li>Under the Dubai International Arbitration Centre (DIAC) or ADGM Arbitration Centre for Users domiciled in the UAE or MENA region.</li>
          </ul>
          <p>13.3 The language of arbitration shall be English. The seat shall be London or Dubai, at Open Socials' discretion.</p>
          <p>13.4 No class actions, group claims, or representative proceedings are permitted.</p>
        </div>
      </section>

      <div className="bg-slate-50 dark:bg-slate-900 p-4 mb-8 rounded-md border border-slate-200 dark:border-slate-800">
        <p className="font-bold">IF YOU DO NOT AGREE TO THESE TERMS, DO NOT ACCESS, REGISTER FOR, OR USE THE PLATFORM.</p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>For questions: <a href="mailto:support@opensocials.net" className="text-primary hover:underline">support@opensocials.net</a></p>
        </CardContent>
      </Card>
      
      <Separator className="my-10" />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Copyright © {new Date().getFullYear()} OpenSocials Ltd. All rights reserved.</p>
      </div>
    </div>
  );
};

export default TermsOfService;
