import Head from "next/head";
import React, {useEffect, useState} from "react";
import styles from "../styles/Home.module.css";
import '../components/balls'
import Balls from "../components/balls";
import Cv from "../components/cv"

export default function Home() {
    const [field, setField] = useState("circle");
    const [showCv, setShowCv] = useState(false);

    return (
        <div className={styles.body}>
            <Head>
                <title>Pontus Lüthi</title>
            </Head>

            <Balls key={field} field={field}/>

            <button className={styles.name} onClick={() => {
                setShowCv(showCv => !showCv);
                setField(field === "circle" ? "disperse" : "circle");
            }}>
                <h1>Pontus Lüthi</h1>
            </button>

            <div className={styles.controls}>
                <button onClick={() => setField("circle")}> Circle </button>
                <button onClick={() => setField("disperse")}> Disperse </button>
                <button onClick={() => setField("lump")}> Lump </button>
            </div>


            <Cv className={showCv ? styles.cv : `${styles.cv} ${styles.hideCv}`} />

        </div>
    );
}

