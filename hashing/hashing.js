var crypto = require("crypto");

var poem = [
  "The power of a gun can kill",
  "and the power of fire can burn",
  "the power of wind can chill",
  "and the power of a mind can learn",
  "the power of anger can rage",
  "inside until it tears u apart",
  "but the power of a smile",
  "especially yours can heal a frozen heart"
];

var Blockchain = {
  blocks: []
};

Blockchain.blocks.push({
  index: 0,
  hash: "000000",
  data: "",
  timestamp: Date.now()
});

function blockHash(bl) {
  return crypto.createHash("sha256").update(JSON.stringify(bl)).digest("hex");
}

function createBlock(data) {
  let height = Blockchain.blocks.length;
  let block = {
    index: height,
    data: data,
    timestamp: Date.now(),
    prevHash: Blockchain.blocks[height - 1].hash
  };

  let hash = blockHash(block);

  block.hash = hash;
  return block;
}

function isEmpty(value) {
  if (value === "" || value === null || value === undefined) {
    return true;
  } else {
    return false;
  }
}

function isGenesisBlock(block) {
  if (block.index === 0 && block.hash === "000000") {
    return true;
  } else {
    return false;
  }
}

async function verifyBlock(chain) {
  return Promise.all(
    chain.map((block, index, blocks) => {
      let { hash, ...rest } = block;
      // console.log(hash)
      // console.log(block.index > 0)
      // console.log((isGenesisBlock(block) || !isEmpty(block.prevHash)))
      // console.log((!isEmpty(block.data) || isGenesisBlock(block)))
      // console.log(blockHash(rest) === hash || isGenesisBlock(block))
      if (
        (!isEmpty(block.data) || isGenesisBlock(block)) &&
        (isGenesisBlock(block) || !isEmpty(block.prevHash)) &&
        block.index >= 0 &&
        (blockHash(rest) === hash || isGenesisBlock(block))
      ) {
        if (
          block.index !== 0 &&
          block.prevHash === blocks[index - 1].hash
        ) {
          return(true);
        }
        return(true);
      } else {
        console.log(`block ${block.index} is invalid`)
        return(false);
      }
    })
  );
}

for (let line of poem) {
  Blockchain.blocks.push(createBlock(line));
}
async function getVerification() {
  if (await verifyBlock(Blockchain.blocks)) {
    console.log("All blocks verified");
  } else {
    console.log("invalid");
  }
}

getVerification();