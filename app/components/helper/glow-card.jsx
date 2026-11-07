// Plain card used by Experience and Education.
// (It used to draw a conic-gradient glow that followed the mouse; removed in the design polish.)
const GlowCard = ({ children, identifier }) => (
  <article
    data-card={identifier}
    className="relative w-full rounded-lg border border-line bg-surface text-gray-200 transition-colors duration-300 hover:border-edge"
  >
    {children}
  </article>
);

export default GlowCard;
