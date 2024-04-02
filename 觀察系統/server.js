//section 1:description 程式變數
//#= version: 0.1, date: 20240331, Creater: jiasian.lin 
const express = require('express');  // 引入 Express 框架
const bodyParser = require('body-parser');  // 引入 body-parser 中間件，用於解析請求的主體
const mongoose = require('mongoose');  // 引入 mongoose，用於 MongoDB 數據庫操作
const app = express();  // 創建 Express 應用程序
const port = 3000;  // 設置應用程序監聽端口為 3000

//section 2:description 進行MongoDB設定

//連接MongoDB 數據庫
mongoose.connect('mongodb://XXXXXX:gXXXXX1@XX.1XX.X0.XX3:27XX7', { useNewUrlParser: true, useUnifiedTopology: true });
// 獲取數據庫連接對象
const db = mongoose.connection;
// 監聽數據庫連接錯誤事件
db.on('error', console.error.bind(console, 'connection error:'));

// 一次性監聽數據庫連接成功事件
db.once('open', function() {  
  console.log('Connected to MongoDB');
});

//section 3:description  MongDB 資料庫環境建立

// MongoDB 取得數據定義
const dataSchema = new mongoose.Schema({  
    day: String,
    state: String,
    summerlog: String

});

 // 創建名為 Data 的 MongoDB
const Data = mongoose.model('Data', dataSchema); 

// 使用 body-parser 中間件解析 JSON 格式的請求主體
app.use(bodyParser.json());  


// 檢查連線狀態
mongoose.connection.on('connected', () => {
    console.log('已連線到 MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB 連線錯誤:', err);
  });

// section 4:description  設置HTML的路由 GET 請求處理函數
// 返回 index.html 文件
app.get('/', (req, res) => {  
    res.sendFile(__dirname + '/index.html'); 
});

app.post('/addData', async (req, res) => {  // 設置 /addData 路由的 POST 請求處理函數
    const { day, state, summerlog } = req.body;  // 從請求主體中獲取 name 和 age
    const newData = new Data({ day, state, summerlog });  // 創建一個新的 Data 實例
    try {
        await newData.save();  // 將新數據保存到數據庫中
        res.sendStatus(200);  // 返回狀態碼 200 表示成功
    } catch (error) {
        console.error(error);  // 如果保存出錯，輸出錯誤信息到控制台
        res.sendStatus(500);  // 返回狀態碼 500 表示服務器內部錯誤
    }
});
// section 5:description  設置HTML 開啟網頁的port
// 啟動應用程序，指定port
app.listen(port, () => {  
    console.log(`Server running at http://localhost:${port}`);
});
