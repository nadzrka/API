const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;
const filePath = "./profiles.json";

app.use(express.json()); 

function readData() {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.get("/", async (req, res) => {
    try {
        const response = await fetch(`http://localhost:${port}/profiles`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
       
        const data = await response.json();
        if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
            return res.send("Hello, no profiles found");
        }

        const names = data.data.map(profile => profile.name).join(", ");        

        res.send(`Hello, ${names}`);
    } catch (error) {
        console.error("Error fetching profile data:", error.message);
        res.status(500).json({ message: "Failed to fetch data" });
    }
});



app.get("/profiles", (req, res) => {
    const profiles = readData();
    res.json({ data: profiles });
});

app.get("/profiles/:id", (req, res) => {
    const profiles = readData();
    const profile = profiles.find(p => p.id == req.params.id);
    
    if (!profile) return res.status(404).json({ message: "Profile tidak ditemukan" });
    res.json(profile);
});

app.post("/profiles", (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) return res.status(400).json({ message: "ID dan Nama wajib diisi" });

    const profiles = readData();
    
    if (profiles.some(p => p.id == id)) {
        return res.status(400).json({ message: "ID sudah ada" });
    }

    profiles.push({ id, name });
    writeData(profiles);

    res.status(201).json({ message: "Data berhasil ditambahkan", data: profiles });
});

app.put("/profiles/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    let profiles = readData();
    const profileIndex = profiles.findIndex(p => p.id == id);

    if (profileIndex === -1) return res.status(404).json({ message: "Profile tidak ditemukan" });

    profiles[profileIndex].name = name;
    writeData(profiles);

    res.json({ message: "Data berhasil diperbarui", data: profiles });
});

app.delete("/profiles/:id", (req, res) => {
    let profiles = readData();
    profiles = profiles.filter(p => p.id != req.params.id);
    writeData(profiles);

    res.json({ message: "Data berhasil dihapus", data: profiles });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
