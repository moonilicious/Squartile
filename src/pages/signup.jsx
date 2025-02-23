import { useState } from "react";
import Head from "next/head";
import Link from 'next/link';
import { auth, provider } from '@/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./signup.module.css";
import { updateProfile } from "firebase/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create user with Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Optionally update the user's profile with their name
      await updateProfile(userCredential.user, { displayName: name });
      
      alert("Signup successful!");
      // Redirect the user to a different page if needed (for example, the homepage)
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Signup Page</title>
      </Head>
      <section className={styles.section}>
        {/* Render exactly 150 <span> elements */}
        {Array.from({ length: 150 }).map((_, i) => (
          <span key={i}></span>
        ))}
        <div className={styles.signup}>
          <div className={styles.content}>
            <h2>Sign Up</h2>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.form}>
              <form onSubmit={handleSignup}>
                <div className={styles.inputBx}>
                  <input
                    type="text"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <i>Name</i>
                </div>
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
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i>Password</i>
                </div>
                <div className={styles.inputBx}>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <i>Confirm Password</i>
                </div>
                <div className={styles.links}>
                  <a href="/login">Already have an account? Login</a>
                </div>
                <div className={styles.inputBx}>
                  <input type="submit" value="Sign Up" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
