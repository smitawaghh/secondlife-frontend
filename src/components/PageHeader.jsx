export default function PageHeader({ eyebrow, title, subtitle, badge, actions }) {
  return (
    <div className="page-hdr">
      <div className="page-hdr__left">
        {eyebrow && <div className="page-hdr__eyebrow">{eyebrow}</div>}
        <h1 className="page-hdr__title">{title}</h1>
        {subtitle && <p className="page-hdr__sub">{subtitle}</p>}
      </div>
      {(badge || actions) && (
        <div className="page-hdr__right">
          {badge}
          {actions}
        </div>
      )}
    </div>
  );
}
