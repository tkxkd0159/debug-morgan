import path from "path";
import { createWriteStream, WriteStream } from "fs";
import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: path.join(process.cwd(), ".env.dev") });
} else {
    dotenv.config({ path: path.join(process.cwd(), ".env") });
}



const accessLogStream: WriteStream =
    process.env.NODE_ENV == "production"
        ? createWriteStream(
              path.join(process.cwd(), "logs/prod", "api-access.log"),
              { flags: "a" }
          )
        : createWriteStream(
              path.join(process.cwd(), "logs/dev", "api-access.log"),
              { flags: "a" }
          );



export default {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    sessSecret: process.env.SESS_SECRET,
};

export { accessLogStream };
