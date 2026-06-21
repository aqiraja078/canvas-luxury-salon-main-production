import Link from "next/link";
import { AdminLoginForm } from "@/app/admin/login/AdminLoginForm";
import { site } from "@/lib/site";

export default function AdminLoginPage() {
  return (
    <div className="admin-login">
      <div className="admin-login__backdrop" aria-hidden />

      <aside className="admin-login__brand">
        <div className="admin-login__brand-inner">
          <span className="admin-login__seal" aria-hidden>
            {site.name.charAt(0)}
          </span>

          <p className="admin-login__brand-name admin-login__reveal admin-login__reveal--1">
            Huma beauty saloon
          </p>

          <p className="admin-login__brand-kicker admin-login__reveal admin-login__reveal--2">
            Staff portal
          </p>

          <h1 className="admin-login__brand-title admin-login__reveal admin-login__reveal--3">
            Welcome back to your
            <span> beauty command centre</span>
          </h1>

          <p className="admin-login__brand-copy admin-login__reveal admin-login__reveal--4">
            Secure access for {site.name} team — manage appointments, services,
            and client care from one private workspace.
          </p>

          <div className="admin-login__areas admin-login__reveal admin-login__reveal--5">
            {site.serviceAreas.map((area) => (
              <span key={area} className="admin-login__area-pill">
                {area}
              </span>
            ))}
          </div>

          <p className="admin-login__brand-note admin-login__reveal admin-login__reveal--6">
            Authorized personnel only
          </p>
        </div>

        <span className="admin-login__corner admin-login__corner--tl" aria-hidden />
        <span className="admin-login__corner admin-login__corner--br" aria-hidden />
      </aside>

      <main className="admin-login__panel">
        <div className="admin-login__panel-inner admin-login__reveal admin-login__reveal--3">
          <div className="admin-login__panel-head">
            <p className="admin-login__panel-kicker">Sign in</p>
            <h2 className="admin-login__panel-title">Enter your credentials</h2>
            <p className="admin-login__panel-sub">
              Use the username and password provided by salon management.
            </p>
          </div>

          <AdminLoginForm />

          <p className="admin-login__back">
            <Link href="/">← Return to {site.name}</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
