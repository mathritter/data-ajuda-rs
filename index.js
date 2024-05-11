import data from "./data.json" assert { type: "json" };
import * as fs from "fs";

const { columns, rows } = data.data.table;

const header = columns.map((val) => val.name);

const values = [];

const csvFolder = "./csv";
const jsonFolder = "./output";
try {
  if (!fs.existsSync(csvFolder)) {
    fs.mkdirSync(csvFolder);
  }
  
  if (!fs.existsSync(jsonFolder)) {
    fs.mkdirSync(jsonFolder);
  }
} catch (err) {
  console.error(err);
}

rows.map((row) => {
  const newObj = {};
  Object.keys(row.cellValuesByColumnId).forEach((cell) => {
    const columnName = columns.filter((val) => val.id == cell)[0].name;
    const columnId = columns.filter((val) => val.id == cell)[0].id;
    let newCell = row.cellValuesByColumnId[cell];
    let arrCell = [];
    if (typeof newCell == "object") {
      const { choices } = columns.filter((col) => col.id == columnId)[0]
        .typeOptions;
      newCell.forEach((newCellVal) => {
        for (var key in choices) {
          if (choices[key].id == newCellVal) {
            arrCell.push(choices[newCellVal].name);
          }
        }
      });
      newCell = arrCell.join(",");
    }
    newObj[columnName] = newCell;
  });
  values.push(newObj);
});

const date = new Date();
const fileName = date.toISOString().replace(/(\:|\.)/g, "_");

console.log(fileName);

const fileValue = JSON.stringify(values);

fs.writeFile(`./output/${fileName}.json`, fileValue, (error) => {
  if (error) {
    console.error(error);

    throw error;
  }

  console.log("data.json written correctly");
});

let csv = "";
csv += header.join(";") + "\n";
fs.readFile(`./output/${fileName}.json`, (err, data) => {
  if (err) throw err;
  const readyData = JSON.parse(data);
  readyData.forEach((fData) => {
    let arr = [];
    header.forEach((val) => {
      let s = fData[val] ? fData[val] : " ";
      arr.push(
        s
          .toString()
          .replace(/\;/g, ",")
          .replace(/(?:\r\n|\r|\n)/g, ",")
          .replace(/\-/g, ",")
      );
    });
    csv += arr.join(";") + "\n";
  });

  fs.writeFile(`./csv/${fileName}.csv`, csv, (error) => {
    if (error) {
      console.error(error);

      throw error;
    }

    console.log("csv written correctly");
  });
});

// readyData.
