const redis = require("redis");
const readline = require("readline");

// 1. Buat koneksi ke Redis Server
// Secara default, Redis berjalan di localhost (127.0.0.1) dan port 6379
const client = redis.createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

async function getAllPlayer() {
  console.log("--- Mengambil Data Semua Pemain ---");
  let cursor = "0";
  let allPlayerKeys = [];

  do {
    // Melakukan SCAN dengan pola 'player:*'
    const result = await client.scan(cursor, {
      MATCH: "player:*",
      COUNT: 100,
    });
    cursor = result.cursor; // Ambil cursor berikutnya
    allPlayerKeys.push(...result.keys); // Tambahkan key yang ditemukan
  } while (cursor !== "0"); // Lanjutkan selama cursor belum kembali ke '0'

  // Sekarang kita bisa ambil data HASH untuk setiap key
  for (const key of allPlayerKeys) {
    const playerData = await client.hGetAll(key);
    console.log(`${key}:`, JSON.stringify(playerData, undefined, 2));
  }
}

async function getById() {
  const prepare_readline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) => {
    prepare_readline.question("Masukkan ID pemain: ", async (id) => {
      const playerKey = `player:${id}`;
      const playerData = await client.hGetAll(playerKey);

      if (Object.keys(playerData).length > 0) {
        console.log(`name: ${playerData.name}`);
        console.log(`age: ${playerData.age}`);
        console.log(`position: ${playerData.position}`);
      } else {
        console.log(`Pemain dengan ID ${id} tidak ditemukan.`);
      }

      prepare_readline.close();
      resolve();
    });
  });
}

async function editPlayer() {
  await getAllPlayer();

  const input_pemain = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) => {
    input_pemain.question("\nMasukkan ID pemain: ", async (id) => {
      const playerKey = `player:${id}`;
      const playerData = await client.hGetAll(playerKey);

      if (Object.keys(playerData).length > 0) {
        console.log(`name: ${playerData.name}`);
        console.log(`age: ${playerData.age}`);
        console.log(`position: ${playerData.position}`);

        input_pemain.close();

        const input_edit_field = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        input_edit_field.question(
          "\nMasukkan field yang ingin diubah: ",
          async (field) => {
            input_edit_field.close();

            const isValidField = ["name", "age", "position"].includes(field);
            if (!isValidField) {
              console.log("Field tidak valid.");
              resolve();
              return;
            }

            const input_edit_value = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
            });

            input_edit_value.question(
              "Masukkan nilai baru: ",
              async (newValue) => {
                await client.hSet(playerKey, field, newValue);
                console.log(`Data pemain dengan ID ${id} berhasil diperbarui.`);

                input_edit_value.close();
                resolve();
              }
            );
          }
        );
      } else {
        console.log(`Pemain dengan ID ${id} tidak ditemukan.`);

        input_pemain.close();
        resolve();
      }
    });
  });
}

async function deletePlayer() {
  await getAllPlayer();

  const input_pemain = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) => {
    input_pemain.question(
      "\nMasukkan ID pemain yg ingin di hapus: ",
      async (id) => {
        const playerKey = `player:${id}`;
        const playerData = await client.hGetAll(playerKey);

        if (Object.keys(playerData).length > 0) {
          console.log(`name: ${playerData.name}`);
          console.log(`age: ${playerData.age}`);
          console.log(`position: ${playerData.position}`);

          await client.del(playerKey);
          console.log(`Pemain dengan ID ${id} telah dihapus.`);

          input_pemain.close();
          resolve();
        } else {
          console.log(`Pemain dengan ID ${id} tidak ditemukan.`);

          input_pemain.close();
          resolve();
        }
      }
    );
  });
}

async function createNewPlayer() {
  const input_new_pemain = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) => {
    input_new_pemain.question("Masukkan ID pemain baru: ", async (id) => {
      const playerKey = `player:${id}`;
      const playerData = await client.hGetAll(playerKey);

      if (Object.keys(playerData).length > 0) {
        console.log(`Pemain dengan ID ${id} sudah ada.`);

        input_new_pemain.close();
        resolve();
      } else {
        input_new_pemain.close();
        const input_name = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        input_name.question("Masukkan nama pemain: ", async (name) => {
          input_name.close();
          const input_age = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          input_age.question("Masukkan umur pemain: ", async (age) => {
            input_age.close();
            const input_position = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
            });

            input_position.question(
              "Masukkan posisi pemain: ",
              async (position) => {
                await client.hSet(playerKey, "name", name);
                await client.hSet(playerKey, "age", age);
                await client.hSet(playerKey, "position", position);
                console.log(`Pemain dengan ID ${id} berhasil ditambahkan.`);

                input_position.close();
                resolve();
              }
            );
          });
        });
      }
    });
  });
}

async function main() {
  try {
    // Koneksi ke Redis
    await client.connect();

    const prepare_readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    await new Promise((resolve) => {
      prepare_readline.question(
        `\nPilih operasi: \n1. Get all player \n2. Get by ID \n3. Create new player \n4. Update player \n5. Delete player \nMasukkan pilihan: `,
        async (number) => {
          const isValid = ["1", "2", "3", "4", "5"].includes(number);
          if (!isValid) {
            console.log("Pilihan tidak valid");
            prepare_readline.close();
            resolve();
            return;
          }

          prepare_readline.close();
          resolve();

          console.log("\n");
          if (number === "1") {
            await getAllPlayer();
          } else if (number === "2") {
            await getById();
          } else if (number === "3") {
            await createNewPlayer();
          } else if (number === "4") {
            await editPlayer();
          } else if (number === "5") {
            await deletePlayer();
          }

          client.destroy();
        }
      );
    });
  } catch (error) {
    console.error("Terjadi kesalahan:", err);
  }
}

main();
