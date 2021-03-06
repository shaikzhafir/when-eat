import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home({ data }) {
  var current = new Date();
  var subuh = new Date();
  var maghrib = new Date();
  let canEat = false;
  subuh.setHours(data.subuh.split(":")[0], data.subuh.split(":")[1], 30);
  maghrib.setHours(data.maghrib.split(":")[0], data.maghrib.split(":")[1], 30);
  if (current > maghrib || current < subuh) {
    canEat = true;
  }
  console.log(canEat);
  return (
    <div className={styles.container}>
      <Head>
        <title>When can i eat</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ textAlign: "center" }}>
        <h1>Subuh: {data.subuh}</h1>
        <h1>Maghrib: {data.maghrib}</h1>
        {canEat ? (
          <>
            <h1>CAN EAT</h1>
            <img src="chicken-eating.gif"></img>
          </>
        ) : (
          <>
            <h1>DONT EAT</h1>
            <img src="cannotEat.jpg"></img>
          </>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log("Connected to PlanetScale!");
  const [rows, fields] = await connection.execute(
    `SELECT * FROM timings ORDER BY id DESC LIMIT 1`
  );
  let data = rows[0];

  return {
    props: {
      data: data,
    },
  };
}
