import { Envs } from "./config/envs";
import { AppRoutes } from "./presentation/app-routes";
import { Server } from "./presentation/server";


(
  () => main()
)();



async function main() {

  const { PORT } = Envs.getEnvs()

  new Server({
    port: PORT,
    routes: AppRoutes.routes()
  }).start()

}

