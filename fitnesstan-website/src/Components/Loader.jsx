// Loader.js
import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.square}></div>
      <div className={styles.content}>
        <div className={styles.title}></div>
        <div className={styles.description}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
