import imageCompression from 'browser-image-compression';
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

export const resizeImages = async (files: File[]) => {
  const options = {
    fileType: 'image/webp',
    initialQuality: 0.8,
    maxWidthOrHeight: 800,
    maxSizeMB: 1,
    useWebWorker: true,
  };

  const compressedFiles = await Promise.all(
    files.map((file) => imageCompression(file, options))
  );

  return compressedFiles;
}
export const formatDate = (date:string) => {
  return date.split("T")[0].split("-").reverse().join("/");
};

export const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date();
    const isDate = date.getDate() === today.getDate()
    const isMonth = date.getMonth() === today.getMonth()
    const isYear = date.getFullYear() === today.getFullYear()
    const dateSplit = date.toISOString().split("T")[0].split("-")
    if (isDate && isMonth && isYear) return "Today"
    if (isYear) return `${dateSplit[2]}/${dateSplit[1]}`
    else return date.toISOString().split("T")[0].split("-").reverse().join("/");
}
