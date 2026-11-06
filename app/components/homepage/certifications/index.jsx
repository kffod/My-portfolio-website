// @flow strict
import Link from "next/link";
import { FaCertificate, FaExternalLinkAlt } from "react-icons/fa";
import { certifications } from "@/utils/data/certifications";

function CertCard({ cert }) {
  return (
    <div
      className={`rounded-lg border p-4 flex flex-col gap-2 transition-all duration-300 ${
        cert.highlight
          ? "border-violet-500/60 bg-gradient-to-br from-raised to-page hover:border-pink-500"
          : "border-line bg-surface hover:border-violet-500"
      }`}
    >
      <div className="flex items-center gap-2 text-xs text-accent">
        <FaCertificate size={12} />
        <span>{cert.issuer} · {cert.date}</span>
      </div>
      <p className="text-white text-sm lg:text-base font-medium flex-1">{cert.name}</p>
      {cert.url ? (
        <Link
          href={cert.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-pink-500 transition-colors duration-200 w-fit"
        >
          <span>Verify</span>
          <FaExternalLinkAlt size={10} />
        </Link>
      ) : (
        <span className="text-xs text-muted">Internal DXC certification</span>
      )}
    </div>
  );
}

function Certifications() {
  const claude = certifications.filter((c) => c.highlight);
  const others = certifications.filter((c) => !c.highlight);

  return (
    <div id="certifications" className="relative z-50 border-t my-12 lg:my-24 border-line">
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-raised"></span>
          <span className="bg-raised w-fit text-white p-2 px-5 text-xl rounded-md">
            Certifications
          </span>
          <span className="w-24 h-[2px] bg-raised"></span>
        </div>
      </div>

      <p className="text-center text-gray-300 text-sm lg:text-base mb-8">
        All four Anthropic Claude certifications. Every badge links to its public verification page.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {claude.map((cert) => (
          <CertCard cert={cert} key={cert.name} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {others.map((cert) => (
          <CertCard cert={cert} key={cert.name} />
        ))}
      </div>
    </div>
  );
};

export default Certifications;
