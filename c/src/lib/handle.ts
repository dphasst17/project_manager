import imageCompression from 'browser-image-compression';
import CryptoJS from "crypto-js";
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

export const endCode = (data: string[] | string, key: string) => {
    const convertData = JSON.stringify(data);
    const code = CryptoJS.AES.encrypt(
        convertData,
        key,
    ).toString();
    const base64Encoded = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(code),
    );
    return base64Encoded;
};
export const decode = (code: string, key: string) => {
    const decoded = CryptoJS.enc.Base64.parse(code).toString(CryptoJS.enc.Utf8);
    const result = CryptoJS.AES.decrypt(decoded, key);
    const stringData = result.toString(CryptoJS.enc.Utf8);
    return JSON.parse(stringData);
};

export const convertDate = (date:string,returnData:'day' | 'time') => {
  const utcDate = new Date(date);
  const vnDate = utcDate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const splitData = vnDate.split(' ');
  const day = splitData[1];
  const time = splitData[0].split(':').slice(0,2).join(':');
  return returnData === 'day' ? day : time;
}
export const convertDataChat = (data:any/*Chat[]*/) => {
  const listDate = Array.from(
        new Set(data.map((d: any/*Chat*/) => d.createdAt.split("T")[0])),
    )
    const result = listDate.map((d: any) => {
        return {
            date: d,
            data: data.filter((c: any/*Chat*/) => c.createdAt.split("T")[0] === d),
        };
    });
    return result;
}
