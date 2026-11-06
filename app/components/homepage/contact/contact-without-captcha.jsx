"use client";
// @flow strict
// Contact form. Sends through Web3Forms (free, no backend) when NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is set.
// Without a key it opens the visitor's email app with the message filled in, so it always works.
import { personalData } from '@/utils/data/personal-data';
import { isValidEmail } from '@/utils/check-email';
import { useState } from 'react';
import { TbMailForward } from "react-icons/tb";
import { toast } from 'react-toastify';

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const EMPTY = { name: '', email: '', message: '' };

function openMailApp({ name, email, message }) {
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
  window.location.href = `mailto:${personalData.email}?subject=${subject}&body=${body}`;
}

function ContactWithoutCaptcha() {
  const [error, setError] = useState({ email: false, required: false });
  const [userInput, setUserInput] = useState(EMPTY);
  const [botcheck, setBotcheck] = useState(false);
  const [sending, setSending] = useState(false);

  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError({ ...error, required: false });
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!userInput.email || !userInput.message || !userInput.name) {
      setError({ ...error, required: true });
      return;
    }
    if (!isValidEmail(userInput.email)) {
      setError({ ...error, email: true, required: false });
      return;
    }
    setError({ email: false, required: false });

    // no key configured: hand the message to the visitor's email app instead
    if (!ACCESS_KEY) {
      openMailApp(userInput);
      toast.info('Opening your email app to send the message.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio message from ${userInput.name}`,
          from_name: 'sachinjadhavofficial.com',
          replyto: userInput.email,
          name: userInput.name,
          email: userInput.email,
          message: userInput.message,
          botcheck, // honeypot: real visitors never tick it
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || 'send failed');

      toast.success("Message sent! I'll get back to you soon.");
      setUserInput(EMPTY);
    } catch (err) {
      console.error('contact form:', err);
      toast.error(`Couldn't send the message. Please email me at ${personalData.email}.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="">
      <p className="font-medium mb-5 text-accent text-xl uppercase">
        Contact with me
      </p>
      <form onSubmit={handleSendMail} noValidate className="max-w-3xl text-white rounded-lg border border-edge p-3 lg:p-5">
        <p className="text-sm text-soft">
          {"Hiring for an AI Engineer, Forward Deployed Engineer or AI Full-Stack role, or building agents for a real business? Send me a message and I'll reply by email."}
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className="text-base">Your Name: </label>
            <input
              id="contact-name"
              className="bg-surface w-full border rounded-md border-edge focus:border-accent ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="text"
              maxLength="100"
              autoComplete="name"
              required={true}
              onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
              onBlur={checkRequired}
              value={userInput.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className="text-base">Your Email: </label>
            <input
              id="contact-email"
              className="bg-surface w-full border rounded-md border-edge focus:border-accent ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="email"
              maxLength="100"
              autoComplete="email"
              required={true}
              value={userInput.email}
              onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
              onBlur={() => {
                checkRequired();
                setError({ ...error, email: !!userInput.email && !isValidEmail(userInput.email) });
              }}
            />
            {error.email &&
              <p className="text-sm text-red-400">Please provide a valid email!</p>
            }
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="contact-message" className="text-base">Your Message: </label>
            <textarea
              id="contact-message"
              className="bg-surface w-full border rounded-md border-edge focus:border-accent ring-0 outline-0 transition-all duration-300 px-3 py-2"
              maxLength="500"
              name="message"
              required={true}
              onChange={(e) => setUserInput({ ...userInput, message: e.target.value })}
              onBlur={checkRequired}
              rows="4"
              value={userInput.message}
            />
          </div>

          {/* honeypot for spam bots, hidden from people and screen readers */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            checked={botcheck}
            onChange={(e) => setBotcheck(e.target.checked)}
          />

          <div className="flex flex-col items-center gap-2">
            {error.required &&
              <p className="text-sm text-red-400">
                Name, email and message are required!
              </p>
            }
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 md:px-12 py-2.5 md:py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold disabled:opacity-60"
            >
              <span>{sending ? 'Sending…' : 'Send Message'}</span>
              <TbMailForward className="mt-1" size={18} />
            </button>
            <p className="text-xs text-muted">
              Or email me directly at{' '}
              <a href={`mailto:${personalData.email}`} className="text-accent hover:text-pink-500">{personalData.email}</a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactWithoutCaptcha;
