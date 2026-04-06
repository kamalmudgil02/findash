import { Search, FileText, MessageCircle, BookOpen, Shield, Info, Scale, History, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQs } from '../data/faqs';
import { useState } from 'react';

const DOCS = [
  {
    id: 'about',
    icon: Info,
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10',
    title: 'About FinDash',
    content: `FinDash is a personal finance dashboard designed to help you track income, expenses, savings goals, and financial trends — all from one place.

Built as an offline-first application, FinDash securely stores all your data and authentication credentials locally in your browser to give you total privacy.

Version: 1.0.0
Built with: React, Recharts, Tailwind CSS
License: MIT`,
  },
  {
    id: 'privacy',
    icon: Shield,
    color: 'text-brand-green',
    bg: 'bg-brand-green/10',
    title: 'Privacy Policy',
    content: `Last updated: April 2026

1. Data Storage
All data (transactions, settings, profile) is stored exclusively in your browser's localStorage. FinDash does not transmit any personal data to external servers.

2. No Tracking
FinDash does not use cookies, analytics trackers, or third-party SDKs that collect personal information.

3. Data Control
You have full control over your data. You can clear all data at any time via Settings → Data & Storage → Clear All Data.

4. Contact
For privacy concerns, contact: privacy@findash.app`,
  },
  {
    id: 'terms',
    icon: Scale,
    color: 'text-brand-purple',
    bg: 'bg-brand-purple/10',
    title: 'Terms & Conditions',
    content: `Last updated: April 2026

1. Acceptance
By using FinDash, you agree to these Terms of Service.

2. Use
FinDash is provided for personal financial tracking purposes only. You may not use it for illegal activities or to store fraudulent financial data.

3. No Warranty
FinDash is provided "as is" without warranties of any kind. The application is not a substitute for professional financial advice.

4. Limitation of Liability
The developers of FinDash shall not be liable for any financial decisions made based on data displayed in the application.

5. Changes
We reserve the right to update these terms at any time. Continued use of the application constitutes acceptance of the updated terms.`,
  },
  {
    id: 'guide',
    icon: BookOpen,
    color: 'text-brand-yellow',
    bg: 'bg-brand-yellow/10',
    title: 'User Guide',
    content: `Getting Started with FinDash

Dashboard
The dashboard shows your financial summary: total balance, income, expenses, recent transactions, savings goal progress, and financial insights.

Adding Transactions
Click "Add Transaction" on the Transactions page. Fill in the description, amount, date, type (Income/Expense), and category. Custom categories can be added in Settings.

Analytics
View your Balance History chart and Expenses by Category donut chart. Hover anywhere on the Balance History chart to see the sliding cursor line and value tooltip.

Settings
Toggle appearance, notifications, and security settings. Changes are applied only after clicking "Save Changes". The Discard button reverts to your last saved settings.

Profile
Edit your personal details, upload a profile photo, and update your bio from the Profile page. Your login email is linked automatically.

Roles
Admins can add/edit/delete transactions and delete all notifications. Viewers have read-only access to most features.`,
  },
  {
    id: 'changelog',
    icon: History,
    color: 'text-brand-red',
    bg: 'bg-brand-red/10',
    title: 'Changelog',
    content: `v1.0.0 — April 2026
• Initial release
• Dashboard with balance, income, expense summary cards
• Balance History line chart with sliding cursor line
• Expenses by Category donut chart with directional tooltip animation
• Financial Insights panel
• Savings Goal tracker
• Full CRUD for transactions
• Custom category management
• Fully functional Settings page with save/discard pattern
• Notifications system linked to transactions
• User profile with photo upload
• Light/Dark mode toggle
• Currency formatter (USD, EUR, GBP, INR, JPY)
• Export transactions as CSV
• Help Center with FAQ search`,
  },
];

function DocCard({ doc }) {
  const [open, setOpen] = useState(false);
  const Icon = doc.icon;
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-background/50 transition-colors"
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${doc.bg}`}>
          <Icon className={`w-5 h-5 ${doc.color}`} />
        </div>
        <span className="flex-1 text-text-primary font-semibold">{doc.title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border">
          <pre className="mt-4 text-text-secondary text-sm whitespace-pre-wrap leading-relaxed font-sans">
            {doc.content}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function HelpCenterPage() {
  const [localSearch, setLocalSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = FAQs.filter(faq =>
    faq.question.toLowerCase().includes(localSearch.toLowerCase()) ||
    (faq.answer && faq.answer.toLowerCase().includes(localSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl pb-8 sm:pb-12">
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">Help Center</h2>
        <p className="text-text-secondary text-sm">Find answers, read our policies, and get support.</p>
      </div>

      {/* Contact Support */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <h3 className="text-text-primary font-bold">Contact Support</h3>
            <p className="text-text-secondary text-sm">Send a message to our admin team.</p>
          </div>
        </div>
        {submitted ? (
          <div className="bg-brand-green/10 border border-brand-green/30 rounded-lg p-4 text-brand-green text-sm font-medium">
            ✓ Message sent! We'll get back to you within 24 hours.
          </div>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              setTimeout(() => setSubmitted(false), 5000);
              e.target.reset();
            }}
          >
            <input
              type="text" required placeholder="Subject"
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-blue"
            />
            <textarea
              required placeholder="How can we help?"
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary min-h-[80px] focus:outline-none focus:border-brand-blue resize-none"
            />
            <button
              type="submit"
              className="self-start bg-brand-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
            >
              Submit Ticket
            </button>
          </form>
        )}
      </div>

      {/* Documentation Accordion */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-brand-blue" />
          </div>
          <h3 className="text-text-primary font-bold">Documentation</h3>
        </div>
        <div className="flex flex-col gap-3">
          {DOCS.map(doc => <DocCard key={doc.id} doc={doc} />)}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h3 className="text-text-primary font-bold">Frequently Asked Questions ({FAQs.length})</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" placeholder="Search FAQs..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-2 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[600px] sm:max-h-[800px] overflow-y-auto pr-1 sm:pr-2">
          {filteredFaqs.map(faq => (
            <div key={faq.id} className="bg-background border border-border rounded-lg p-4">
              <p className="text-brand-blue font-bold text-sm mb-2">{faq.question}</p>
              <p className="text-text-secondary text-sm">{faq.answer || faq.click}</p>
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="col-span-2 text-center py-8 text-text-secondary text-sm">
              No FAQs matching "{localSearch}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
