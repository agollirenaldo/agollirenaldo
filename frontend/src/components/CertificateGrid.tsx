import { format } from "date-fns";
import type { Certificate } from "../types";

interface CertificateGridProps {
  certificates: Certificate[];
}

export function CertificateGrid({ certificates }: CertificateGridProps) {
  if (!certificates.length) {
    return <p className="empty-state">Ende nuk janë lëshuar certifikata.</p>;
  }

  return (
    <div className="certificate-grid">
      {certificates.map((certificate) => (
        <article key={certificate.id} className="certificate-card">
          <header>
            <span className="material-symbols-rounded">verified</span>
            <div>
              <h3>Certifikatë për kursin #{certificate.course_id}</h3>
              <p>Përdoruesi #{certificate.user_id}</p>
            </div>
          </header>
          <p className="certificate-card__date">
            Lëshuar më {format(new Date(certificate.issued_at), "d MMMM yyyy")}
          </p>
          {certificate.credential_url && (
            <a
              className="ghost-button ghost-button--inline"
              href={certificate.credential_url}
              target="_blank"
              rel="noreferrer"
            >
              Shiko kredencialin
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
