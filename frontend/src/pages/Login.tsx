import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { LoginPayload } from "../types";

const ALLOWED_DOMAIN = "example.com";

export function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>();

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const domain = values.email.split("@")[1];
    if (domain !== ALLOWED_DOMAIN) {
      setServerError(`Lejohet vetëm domain-i ${ALLOWED_DOMAIN}`);
      return;
    }

    try {
      await login(values);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Identifikimi dështoi");
      }
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <header>
          <p>Mirëseerdhe në platformën më moderne të të nxënit.</p>
          <h1>Hyr në llogarinë tënde</h1>
        </header>
        <div className="form-grid">
          <label className="form-field">
            Email institucional
            <input
              type="email"
              placeholder="emri@company.com"
              autoComplete="email"
              {...register("email", {
                required: "Email i detyrueshëm",
                pattern: {
                  value: /.+@.+\..+/, // simple validation
                  message: "Email i pavlefshëm",
                },
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </label>
          <label className="form-field">
            Fjalëkalimi
            <input
              type="password"
              placeholder="Shkruaj fjalëkalimin"
              autoComplete="current-password"
              {...register("password", {
                required: "Fjalëkalimi i detyrueshëm",
                minLength: {
                  value: 6,
                  message: "Të paktën 6 karaktere",
                },
              })}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </label>
        </div>
        {serverError && <p className="form-error">{serverError}</p>}
        <button className="primary-button" type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? "Duke u identifikuar..." : "Hyr"}
        </button>
      </form>
    </div>
  );
}
