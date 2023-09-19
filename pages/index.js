import Head from "next/head";
import React, {useEffect, useState} from "react";
import styles from "../styles/Home.module.css";
import '../components/balls'
import Balls from "../components/balls";

export default function Home() {
    const [field, setField] = useState("circle");


    return (
        <div className={styles.body}>
            <Head>
                <title>Pontus Lüthi</title>
            </Head>

            <Balls key={field} field={field}/>

            <div className={styles.name}>
                <h1>Pontus Lüthi</h1>
            </div>

            <div className={styles.controls}>
                <button onClick={() => setField("circle")}> Circle </button>
                <button onClick={() => setField("disperse")}> Disperse </button>
                <button onClick={() => setField("lump")}> Lump </button>
            </div>
        </div>
    );
}

