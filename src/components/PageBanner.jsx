export default function PageBanner({ icon, eyebrow, title, subtitle, actions }) {
  return (
    <div className="page-banner">
      <div className="page-banner__inner">
        {icon && <div className="page-banner__icon">{icon}</div>}
        <div className="page-banner__text">
          {eyebrow && <div className="page-banner__eyebrow">{eyebrow}</div>}
          <h1 className="page-banner__title">{title}</h1>
          {subtitle && <p className="page-banner__sub">{subtitle}</p>}
        </div>
        {actions && <div className="page-banner__actions">{actions}</div>}
      </div>
    </div>
  );
}
