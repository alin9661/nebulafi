require("dotenv").config();

const cli = require("@aptos-labs/ts-sdk/cli");

async function test() {
  const move = new cli.Move();

  await move.test({
    packageDirectoryPath: "contract",
    namedAddresses: {
      message_board_addr: "0x100",
    },
  });
}
test();
