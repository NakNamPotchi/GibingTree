const express = require("express");
const app = express();

require("./config/mongoose.config");

app.use(express.json(), express.urlencoded({ extended: true }));

const AllWalletRoutes = require("./routes/wallet.routes");
const AllWinnerRoutes = require("./routes/winner.routes");
const AllCrystalRoutes = require("./routes/crystal.routes");
const AllShopRoutes = require("./routes/shop.routes");
const AllLeaderRoutes = require("./routes/leader.routes");
const AllTimestampRoutes = require("./routes/timestamp.routes");
AllWalletRoutes(app);
AllWinnerRoutes(app);
AllCrystalRoutes(app);
AllLeaderRoutes(app);
AllTimestampRoutes(app);
AllShopRoutes(app);

app.listen(8080, () => console.log("The server is all fired up on port 8080"));

