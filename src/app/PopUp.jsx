import Link from 'next/link';
import { useState } from 'react';
import { auth, provider } from '@/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import styles from './PopUp.module.css';

const colors = ['c1', 'c2', 'c3', 'c4'];
const eyes = ['e1', 'e2', 'e3', 'e4'];
const mouths = ['m1', 'm2', 'm3', 'm4'];

const PopUp = ({ onPlay }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const [eyeIndex, setEyeIndex] = useState(0);
  const [mouthIndex, setMouthIndex] = useState(0);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch('http://localhost:5000/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        }),
      });

      const data = await response.json();
      console.log('User:', data);
    } catch (error) {
      console.error('Google sign-in failed', error);
    }
  };

  const changeIndex = (type, direction) => {
    if (type === 'color') {
      setColorIndex((prev) => (prev + direction + colors.length) % colors.length);
    } else if (type === 'eyes') {
      setEyeIndex((prev) => (prev + direction + eyes.length) % eyes.length);
    } else if (type === 'mouth') {
      setMouthIndex((prev) => (prev + direction + mouths.length) % mouths.length);
    }
  };

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popup}>
        <h1 className={styles.title}>SQUARTILE</h1>
        
        <div className={styles.characterSelection}>
          <div className={styles.arrowContainer}>
            <button onClick={() => changeIndex('color', -1)} className={styles.arrowButton}>&lt;</button>
            <button onClick={() => changeIndex('eyes', -1)} className={styles.arrowButton}>&lt;</button>
            <button onClick={() => changeIndex('mouth', -1)} className={styles.arrowButton}>&lt;</button>
          </div>
          
          <div className={styles.characterPreview}>
            <div className={styles.characterStack}>
              <img src={`/tilehead/colours/${colors[colorIndex]}.png`} alt="Color" className={styles.characterPart} />
              <img src={`/tilehead/eyes/${eyes[eyeIndex]}.png`} alt="Eyes" className={styles.characterPart} />
              <img src={`/tilehead/mouth/${mouths[mouthIndex]}.png`} alt="Mouth" className={styles.characterPart} />
            </div>
          </div>
          
          <div className={styles.arrowContainer}>
            <button onClick={() => changeIndex('color', 1)} className={styles.arrowButton}>&gt;</button>
            <button onClick={() => changeIndex('eyes', 1)} className={styles.arrowButton}>&gt;</button>
            <button onClick={() => changeIndex('mouth', 1)} className={styles.arrowButton}>&gt;</button>
          </div>
        </div>
        
        <button className={styles.playButton} onClick={onPlay}>Play Now</button>
        
        <div className={styles.authLinks}>
          <p>
            Already have an account?{' '}
            <Link href="/login" className={styles.authLink}>Log In</Link>
          </p>
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className={styles.authLink}>Sign Up</Link>
          </p>
          <p>
            <button onClick={handleGoogleSignIn} className={styles.googleSignIn}>
              Sign in with Google
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopUp;