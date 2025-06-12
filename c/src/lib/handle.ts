export const ExcelReader = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result?.toString();
      if (!text) {
        reject(new Error("File data is empty"));
        return;
      }

      const rows = text.split('\n').map(row => row.split(';'));
  
      const headers = rows[0].map(header => header.trim());

      const dataObjects = rows.slice(1)
        .filter(row => row.some(cell => cell.trim() !== "")) // Lọc dòng trống
        .map(row => {
          return headers.reduce((obj:any, header, index) => {
            obj[header] = row[index]?.trim() || ""; // Gán giá trị theo cột
            return obj;
          }, {});
        });

      resolve(dataObjects);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

export const formatDate = (date:string) => {
  return date.split("T")[0].split("-").reverse().join("/");
};

