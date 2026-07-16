import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

export default function Auth() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If email confirmation is on, there's a user but no session yet.
        if (data.user && !data.session) {
          setNotice("Bestätige deine E-Mail-Adresse und melde dich danach an.");
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || "Etwas ist schiefgegangen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__brand">
        artikel<span className="brand__dot">.</span>
      </div>
      <p className="auth__tag">Deine Stapel, überall synchron.</p>

      <form className="auth__form" onSubmit={submit}>
        <label className="auth__field">
          <span>E-Mail</span>
          <input
            type="email"
            value={email}
            autoComplete="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="auth__field">
          <span>Passwort</span>
          <input
            type="password"
            value={password}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        {error && <p className="auth__error">{error}</p>}
        {notice && <p className="auth__notice">{notice}</p>}

        <button className="btn auth__submit" type="submit" disabled={busy}>
          {busy ? "…" : mode === "signup" ? "Konto erstellen" : "Anmelden"}
        </button>
      </form>

      <button
        className="auth__toggle"
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setError(null);
          setNotice(null);
        }}
      >
        {mode === "signup" ? "Du hast schon ein Konto? Anmelden" : "Neu hier? Konto erstellen"}
      </button>
    </div>
  );
}
