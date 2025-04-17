'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Contact() {
  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <div className="badge badge-outline badge-primary mb-4">Contact Us</div>
          <h1 className="text-4xl font-bold mb-2">Get In Touch</h1>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Have questions or feedback about BreakMyAssignment? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="card bg-base-200 border border-base-300 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Send a Message</h2>
              <form className="space-y-6">
                <div className="form-control">
                  <label className="label text-sm font-medium">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="input input-bordered bg-base-100"
                  />
                </div>
                <div className="form-control">
                  <label className="label text-sm font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="input input-bordered bg-base-100"
                  />
                </div>
                <div className="form-control">
                  <label className="label text-sm font-medium">Message</label>
                  <textarea
                    className="textarea textarea-bordered bg-base-100"
                    rows={5}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full">Send Message</button>
              </form>
            </div>
          </div>

          {/* Contact Info + FAQs */}
          <div className="space-y-6">
            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body flex flex-row gap-4 items-start">
                <div className="text-2xl">📧</div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-base-content/70">support@breakmyassignment.com</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body flex flex-row gap-4 items-start">
                <div className="text-2xl">⏰</div>
                <div>
                  <h3 className="font-semibold text-lg">Support Hours</h3>
                  <p className="text-base-content/70">Monday - Friday: 9AM - 6PM EST</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-200 border border-base-300 shadow-sm">
              <div className="card-body">
                <h3 className="font-semibold text-lg mb-2">Frequently Asked Questions</h3>
                <div className="space-y-4 text-sm text-base-content/70">
                  <div>
                    <p className="font-semibold text-primary mb-1">How accurate is the AI analysis?</p>
                    <p>We aim for high accuracy using GPT-4. Our models continue to improve based on feedback.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-primary mb-1">How is my data protected?</p>
                    <p>Your files are stored securely. We never share your data with third parties.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/about" className="link link-hover text-primary text-sm">
                    View all FAQs →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
