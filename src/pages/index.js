import Head from 'next/head'

export default function Home({ data }) {
  console.log(`now is ${new Date} subuh is ${data.subuh}, maghrib is ${data.maghrib}`);
  const canEat = calculateCanEat(data.maghrib, data.subuh)
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl font-bold underline text-center">
        When eat?
      </h1>
      <div className='flex justify-center mt-10'>
        {canEat ?
          <div>
            <h1 className='text-center'>eat time</h1>
            <img src="/can-eat.jpg" alt="food" />
          </div> :
          <div>
            <h1 className='text-center'>allah is watching</h1>
            <img src="/cannot-eat.jpg" alt="no food" />
          </div>}
      </div>

    </>
  )
}


function calculateCanEat(maghrib, subuh) {
  maghrib = new Date(maghrib)
  subuh = new Date(subuh)
  const now = new Date()
  if (now > maghrib) {
    return true
  }
  if (now > subuh && now < maghrib) {
    return false
  }
  else {
    return false
  }
}


export async function getServerSideProps() {
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log("Connected to PlanetScale!");
  const [rows] = await connection.execute(
    `SELECT * FROM timings ORDER BY id DESC LIMIT 1`
  );
  return {
    props: {
      data: rows[0],
    },
  };
}

