import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { users } from "./defaultUser.js";
import User from "./models/user.js";
import path,{dirname} from 'path'
import { fileURLToPath } from 'url';
const __dirname=dirname(fileURLToPath(import.meta.url))
import userRoutes from "./routes/users.js";
import transactionsRoutes from "./routes/transactions.js"; // imp

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/users", userRoutes); // imp /users/register
app.use("/transactions", transactionsRoutes); // imp /users/register
app.use("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"public","index.html"));
})

const createDefaultUsers = async () => {
  try {
    for (const userData of users) {
      const { username } = userData;
      const existingUser = await User.findOne({ username });
      console.log(existingUser);
      if (!existingUser) {
        await User.create(userData);
        console.log(`User created: ${username}`);
      }
    }
  } catch (error) {
    console.error("Error creating default users:", error);
  }
}

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, async () => {
      await createDefaultUsers();
      
    })
  )
  .catch((e) => console.log(e.message));
