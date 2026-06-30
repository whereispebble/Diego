import { fileURLToPath, URL } from "node:url";

const resolveProjectFile = (path) => fileURLToPath(new URL(path, import.meta.url));

export default {
  build: {
    rollupOptions: {
      input: {
        home: resolveProjectFile("index.html"),
        perfil: resolveProjectFile("perfil.html"),
        proyectos: resolveProjectFile("proyectos.html"),
        archivo: resolveProjectFile("archivo.html"),
        reservas: resolveProjectFile("reservas.html")
      }
    }
  }
};
