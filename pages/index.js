import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import '../components/balls'
import Balls from "../components/balls";

export default function Home() {


    return (
        <div className={styles.body}>
            <Head>
                <title>Pontus Lüthi</title>
            </Head>

            <Balls/>

            <div className={styles.name}>
                <h1>Pontus Lüthi</h1>
            </div>
        </div>
    );
}

