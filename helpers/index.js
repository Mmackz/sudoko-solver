export function getRegion(string, row, col) {
   const arr = [];

   // find which region to check based on row/col inputs
   const regionNum = Math.floor(row / 3) * 3 + Math.floor(col / 3);

   for (let i = 0; i < 81; i++) {
      // skip the exact co-ordinate for the input row/col
      if (i == row * 9 + col) continue;

      // put in array all values in the region
      const rowValue = Math.floor(Math.floor(i / 9) / 3) * 3;
      if (Math.floor(i / 3) - 3 * Math.floor(i / 9) + rowValue === regionNum) {
         arr.push(string[i]);
      }
   }
   return arr;
}

export function getRow(string, row) {
   return [...string.slice(row * 9, row * 9 + 9)];
}

export function getColumn(string, col) {
   const arr = [];
   for (let i = col; i < 81; i += 9) {
      arr.push(string[i]);
   }
   return arr;
}

export function splitToRows(string) {
   const arr = [];
   for (let i = 9; i <= 81; i += 9) {
      arr.push([...string.slice(i - 9, i)]);
   }
   return arr;
}