import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Top Down News Explorations
        </h1>


        <div className={styles.grid}>
          <div className={styles.card}>
            <Link href={`/metatopic_reporting`}>
              <a>
                <h2>Ukraine Russia War compared to Trump, Covid, Abortion, etc.</h2>
                <p>Track coverage over time and see key points</p>
              </a>
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://topdown.substack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Top Down News
        </a>
      </footer>
    </div>
  )
}
