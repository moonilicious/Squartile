import { useState } from "react";
import Head from "next/head";
import Link from 'next/link';
import { auth, provider } from '@/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      // Redirect user to dashboard or homepage
      window.location.href = "/";
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login Page</title>
      </Head>
      <section className={styles.section}>
        {Array.from({ length: 150 }).map((_, i) => (
          <span key={i}></span>
        ))}
        <div className={styles.signin}>
          <div className={styles.content}>
            <h2>Log In</h2>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.form}>
              <form onSubmit={handleLogin}>
                <div className={styles.inputBx}>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <i>Email</i>
                </div>
                <div className={styles.inputBx}>
                  <input
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i>Password</i>
                </div>
                <div className={styles.links}>
                  <a href="#">Forgot Password</a>
                  <a href="/signup">Signup</a>
                </div>
                <div className={styles.inputBx}>
                  <input type="submit" value="Login" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
