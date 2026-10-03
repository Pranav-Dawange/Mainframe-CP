import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Bot, ShieldAlert, Clock, Search, Lock, CheckCircle2, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What documents can I store?',
    a: 'LifeVault supports invoices, warranties, insurance documents, vehicle documents, certificates, bills, rental agreements, educational records, membership cards, service receipts, and any other important personal documents.'
  },
  {
    q: 'Can LifeVault detect warranty information?',
    a: 'Yes. When warranty details are present in the uploaded document, LifeVault will automatically extract the warranty period and expiry date and add it to your Warranty Tracker.'
  },
  {
    q: 'Can I search my documents?',
    a: 'Yes. LifeVault includes a powerful intelligent search that lets you find documents by name, type, or extracted content. You can also use the AI Assistant to ask natural-language questions about your documents.'
  },
  {
    q: 'Can I receive expiry reminders?',
    a: 'Yes. LifeVault tracks expiry dates for all your documents and warranties, and generates notifications when documents or warranties are approaching expiry.'
  },
  {
    q: 'Where are my records stored?',
    a: 'Your documents and extracted information are stored in a secure backend infrastructure. The system uses JWT-based authentication to ensure only you can access your records.'
  }
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full text-left p-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-primary">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 bg-white">{a}</div>}
    </div>
  );
};

const Landing = () => {
  return (
    <div className="flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-accent" />
            <span className="text-xl font-bold text-primary">LifeVault</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#security" className="hover:text-primary transition-colors">Security</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm">Login</Link>
            <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-accent text-sm font-medium px-4 py-2 rounded-full mb-6">
                <ShieldAlert className="w-4 h-4" />
                Enterprise-grade document intelligence
              </div>
              <h1 className="text-5xl font-extrabold text-primary tracking-tight leading-tight mb-6">
                Everything important, <span className="text-accent">in one secure place.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10">
                LifeVault helps you organize important documents, track warranties and expiry dates, and instantly find the information you need — in any language.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-primary text-base px-8 py-3 text-center">
                  Get Started Free
                </Link>
                <a href="#features" className="btn-secondary text-base px-8 py-3 text-center">
                  Explore Features
                </a>
              </div>
            </div>
            {/* Dashboard Preview */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-primary-400 text-xs ml-2">LifeVault Dashboard</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Documents', value: '42' },
                    { label: 'Warranties', value: '8' },
                    { label: 'Expiring Soon', value: '3' }
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <p className="text-2xl font-bold text-primary">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Upcoming Expiries</p>
                  {[
                    { name: 'Vehicle Insurance', days: '10 days', color: 'text-orange-500' },
                    { name: 'Laptop Warranty', days: '54 days', color: 'text-green-600' },
                    { name: 'Vehicle PUC', days: '63 days', color: 'text-green-600' }
                  ].map(r => (
                    <div key={r.name} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-primary font-medium">{r.name}</span>
                      <span className={`text-xs font-semibold ${r.color}`}>{r.days}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-surface py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-primary mb-4">Intelligent Document Management</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to organize, track, and understand your personal documents.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Smart Document Management', icon: FileText, desc: 'Organize invoices, certificates, insurance documents and other important files in one centralized vault.' },
              { title: 'AI Information Extraction', icon: Bot, desc: 'Automatically identify useful information such as dates, amounts, document types and warranty periods.' },
              { title: 'Warranty Tracking', icon: ShieldAlert, desc: 'Keep track of product warranties and receive timely reminders before they expire.' },
              { title: 'Expiry Alerts', icon: Clock, desc: 'Monitor documents with expiration dates — insurance, licenses, PUC, and more.' },
              { title: 'Intelligent Search', icon: Search, desc: 'Search documents using natural language. Find any document in seconds.' },
              { title: 'Secure Records', icon: Lock, desc: 'Maintain structured records with enterprise-grade backend infrastructure and controlled access.' },
            ].map((feature, idx) => (
              <div key={idx} className="card p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-gray-600">Four simple steps to organize your entire document life.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {[
              { step: '01', title: 'Upload', desc: 'Drag & drop your PDF, image, or document into LifeVault.' },
              { step: '02', title: 'Analyze', desc: 'LifeVault identifies the document and extracts all useful information.' },
              { step: '03', title: 'Organize', desc: 'The document and its metadata are automatically categorized and organized.' },
              { step: '04', title: 'Track', desc: 'Monitor warranties, expiry dates, and receive timely reminders.' },
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-blue-200">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="bg-primary py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-accent-light" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Built for information you can't afford to lose.</h2>
          <p className="text-primary-400 text-lg mb-10 max-w-2xl mx-auto">
            LifeVault takes security seriously. Your documents are protected at every layer — from authentication to storage.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { title: 'Secure Authentication', desc: 'JWT-based session management keeps your account protected.' },
              { title: 'Controlled Access', desc: 'Only you can access your documents. No cross-user data access.' },
              { title: 'Activity Tracking', desc: 'Every action is logged in a full audit trail for your review.' },
              { title: 'Enterprise Backend', desc: 'Backed by an enterprise-grade infrastructure with structured data storage.' },
              { title: 'Mainframe Integration', desc: 'Critical records are processed through an IBM z/OS backend for reliability.' },
              { title: 'Safe Error Handling', desc: 'No sensitive details are ever exposed through the frontend.' },
            ].map((s, idx) => (
              <div key={idx} className="bg-primary-800 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-light flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">{s.title}</p>
                    <p className="text-sm text-primary-400 mt-1">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-surface py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FaqItem key={idx} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to organize your life?</h2>
          <p className="text-blue-100 mb-8">Join LifeVault and take control of your important documents today.</p>
          <Link to="/signup" className="inline-block px-10 py-4 bg-white text-accent font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-10 px-4 text-center text-primary-400">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-accent-light" />
          <span className="text-white font-bold">LifeVault</span>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} LifeVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
