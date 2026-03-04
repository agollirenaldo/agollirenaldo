import { useEffect, useState } from "react";

import { CertificateGrid } from "../components/CertificateGrid";
import { useAuth } from "../context/AuthContext";
import { apiClient, withAuth } from "../services/apiClient";
import type { Certificate } from "../types";

export function Certificates() {
  const { token } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadCertificates() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<Certificate[]>("/certificates/me", withAuth(token));
        setCertificates(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Nuk u ngarkuan certifikatat");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadCertificates();
  }, [token]);

  if (isLoading) {
    return <p className="empty-state">Duke përgatitur certifikatat tuaja...</p>;
  }

  if (error) {
    return <p className="empty-state">{error}</p>;
  }

  return (
    <section>
      <div className="section-header">
        <h2>Certifikatat</h2>
        <span>{certificates.length} të fituara</span>
      </div>
      <CertificateGrid certificates={certificates} />
    </section>
  );
}
