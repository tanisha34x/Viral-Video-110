import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Alcash Zone - Your Guide to Online Monetization</title>
        <meta name="description" content="Learn how to monetize your online presence with expert guides on AdSense, Adsterra, blogging, and more." />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Alcash Zone - Your Guide to Online Monetization" />
        <meta property="og:description" content="Learn how to monetize your online presence with expert guides on AdSense, Adsterra, blogging, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://alcashzone.com">Alcash Zone</a>
        </h1>

        <p className={styles.description}>
          Your comprehensive guide to online monetization
        </p>

        <div className={styles.grid}>
          <a href="https://alcashzone.com/category/adsterra-earning/" className={styles.card}>
            <h2>Adsterra Earnings &rarr;</h2>
            <p>Master the art of monetizing your traffic with Adsterra. Learn proven strategies and best practices.</p>
          </a>

          <a href="https://alcashzone.com/category/adsense-approval/" className={styles.card}>
            <h2>AdSense Mastery &rarr;</h2>
            <p>Get expert tips on AdSense approval and learn how to maintain a successful AdSense account.</p>
          </a>

          <a href="https://alcashzone.com/category/blogging/" className={styles.card}>
            <h2>Blogging Success &rarr;</h2>
            <p>Discover the secrets of successful blogging, from content creation to traffic generation.</p>
          </a>

          <a href="https://newstick.us" className={styles.card}>
            <h2>Latest News &rarr;</h2>
            <p>Stay updated with the latest news in digital marketing, technology, and online monetization.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://alcashzone.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            Alcash Zone
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home