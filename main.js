const express = require("express");
const cors = require("cors"); // 👈 追加
const fs = require("fs").promises;
const path = require("path");

const app = express();
app.use(cors()); // 👈 これを追加してCORSを許可
app.use(express.static("public"));

// ▼ テンプレートエンジンの設定
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // views フォルダがある場所を指定

// ▼ 静的ファイル
app.use(express.static(path.join(__dirname, "public")));




async function loadAllScenes() {
    const files = [
        path.join(__dirname,"public", "data", "okane.json"),
        path.join(__dirname, "public","data", "kenkou.json"),
        path.join(__dirname, "public","data", "zikan.json"),
         path.join(__dirname, "public","data", "zikokeihatu.json"),
        path.join(__dirname,"public", "data", "story.json")
        // 必要があれば他のJSONも追加
    ];

    let allScenes = {};
    for (const file of files) {
        try {
 console.log(`読み込み中: ${file}`);
            const data = await fs.readFile(file, "utf-8");
            const json = JSON.parse(data);
            allScenes = { ...allScenes, ...json }; // マージ
        } catch (err) {
            console.error(`読み込みエラー: ${file}`, err);
        }
    }
 console.log("すべてのシーンを読み込みました");
    return allScenes;
}

// APIルート：任意のscene名で読み込める
app.get("/api/scene/:name", async (req, res) => {
    const sceneName = req.params.name;
    const allScenes = await loadAllScenes();

    if (allScenes[sceneName]) {
        res.json(allScenes[sceneName]);
    } else {
        res.status(404).json({ error: "シーンが見つかりません" });
    }
});

//  ルート (`/`) で `index.ejs` を表示 (変更)
app.get('/noberu', (req, res) => {
//  res.send("noberuページテスト中"); // ← 一時的にテンプレート表示を止めて動作確認
    res.render('index'); // `views/index.ejs` を表示
});

app.get('/', (req, res) => {
//  res.send("noberuページテスト中"); // ← 一時的にテンプレート表示を止めて動作確認
    res.render('index'); // `views/index.ejs` を表示
});




const PORT = 4000;
app.listen(PORT, () => {
console.log(`Server running at http://0.0.0.0:${PORT}`);
});
