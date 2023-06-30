import buildServer from './server';

async function main() {
  const server = await buildServer();

  try {
    await server.listen({ port: 3000 });

    console.log(`Server ready at http://localhost:3000`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
