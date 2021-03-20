const elasticSearch = require("elasticsearch");
const { Model, Field } = require("fireo");

const esClient = new elasticSearch.Client({ host: "http://localhost:9200" });

String.prototype.allReplace = function (arr) {
  let retStr = this;
  for (let x of arr) {
    retStr = retStr.replace(new RegExp(x, "g"), "");
  }
  return retStr;
};

class Ayah extends Model {
  uci = Field.Text();
  number = Field.Number();
  surah_number = Field.Number();
  content = Field.Map();

  static config = {
    collectionName: "quran",
  };
}

const filterContent = (text) => {
  let content = ayah.content.english.allReplace([
    ",",
    "-",
    "!",
    ";",
    ":",
    '"',
    "\\?",
    "\\.",
    "\\[",
    "\\]",
  ]);
  content = content.replace(/\s+/g, " ").trim();
  return content.toLowerCase();
};

const main = async () => {
  const snapshot = await Ayah.collection.fetch();

  const elkData = [];

  for (ayah of snapshot.list) {
    // Only pass the first Bismillah
    if (ayah.number === 0 && ayah.id !== "1-0") {
      continue;
    }

    elkData.push({ create: { _id: ayah.id } });
    elkData.push({ text: filterContent(ayah.content.english) });

    console.log("surah", ayah.surah_number, "ayah ", ayah.number);
  }

  try {
    console.log("Importing data into ELK...");
    const result = await esClient.bulk({ index: "quran", body: elkData });
    console.log("Complete!!!");
  } catch (err) {
    console.log(err);
  }
};

main();
