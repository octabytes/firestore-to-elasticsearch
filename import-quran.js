const { Model, Field } = require("fireo");

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
    "\\.",
    "\\[",
    "\\]",
  ]);
  content = content.replace(/\s+/g, " ").trim();
  return content.toLowerCase();
};

const main = async () => {
  const snapshot = await Ayah.collection.fetch(7);

  const elkData = [];

  for (ayah of snapshot.list) {
    elkData.push({ create: { _id: ayah.id } });
    elkData.push({ text: filterContent(ayah.content.english) });
  }

  console.log(elkData);
};

main();
