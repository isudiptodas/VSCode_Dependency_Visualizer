import * as fs from "fs";
import * as path from "path";

export function scanDependencies(rootPath: string) {

  const packageJsonPath = path.join(
    rootPath,
    "package.json"
  );

  if (!fs.existsSync(packageJsonPath)) {
    return [];
  }

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8")
  );

  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  const dependencyNames = Object.keys(dependencies);

  return dependencyNames.map((dep, index) => {

    const total = dependencyNames.length;

    const hue = Math.floor(
      (index * 360) / total
    );

    return {
      name: dep,

      size:
        Math.floor(Math.random() * 300) + 50,

      color: `hsl(${hue}, 75%, 60%)`
    };
  });
}