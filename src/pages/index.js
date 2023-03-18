import Head from "next/head";

export default function Home({ data }) {
  const canEat = calculateCanEat(data.maghrib, data.subuh);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl font-bold underline text-center">When eat?</h1>
      <div className="flex justify-center mt-10">
        {canEat ? (
          <div>
            <h1 className="text-center">eat time</h1>
            <img src="/can-eat.jpg" alt="food" />
          </div>
        ) : (
          <div>
            <h1 className="text-center">allah is watching</h1>
            <img src="/cannot-eat.jpg" alt="no food" />
          </div>
        )}
      </div>
    </>
  );
}

function calculateCanEat(maghrib, subuh) {
  // convert to local time in browser
  const maghribLocalTime = new Date();
  maghribLocalTime.setHours(maghrib.split(":")[0], maghrib.split(":")[1], 10);
  const subuhLocalTime = new Date();
  subuhLocalTime.setHours(subuh.split(":")[0], subuh.split(":")[1], 0);
  const now = new Date();
  console.log(
    `now is ${now} subuh is ${subuhLocalTime}, maghrib is ${maghribLocalTime}`
  );
  // if now is after maghrib or before subuh, can eat
  if (now > maghribLocalTime || now < subuhLocalTime) {
    return true;
  }
  // if now is after subuh and before maghrib, cannot eat
  if (now > subuhLocalTime && now < maghribLocalTime) {
    return false;
  }
  // if something else, cannot eat
  else {
    return false;
  }
}

export async function getServerSideProps() {
  try {
    const Redis = require("ioredis");
    require("dotenv").config();

    let client = new Redis(process.env.REDIS_URL);
    client.on("error", function (err) {
      throw err;
    });
    const subuh = await client.get("subuh");
    const maghrib = await client.get("maghrib");

    return {
      props: {
        data: {
          subuh: subuh,
          maghrib: maghrib,
        },
      },
    };
  } catch (error) {
    return {
      props: {
        data: {
          subuh: "5:30",
          maghrib: "19:30",
        },
      },
    };
  }
}
