import fs, { readdirSync, stat } from 'fs';
import path from 'path';
import { isBinaryFileSync } from 'isbinaryfile';
import 'colors';

type BasicTypes = string | number | boolean;

type Context = {
  src: { dir: string; file: string; content?: string | Buffer; isBinary: boolean };
  dist?: { dir: string; file: string };
};

type CompileContext = {
  [key: string]: BasicTypes | ((context: Context) => BasicTypes);
};

function getPath(relativePath: string) {
  return path.resolve(__dirname, '..', relativePath);
}

function fillVars(vars: CompileContext, template: string, context?: Context) {
  let result = template;
  for (const key in vars) {
    result = result.replace(
      new RegExp(`{{${key}}}`, 'g'),
      typeof vars[key] === 'function' ? (vars[key] as Function)(context).toString() : vars[key].toString(),
    );
  }
  return result;
}

function readDirectory(_path: string, files: string[] = []): string[] {
  readdirSync(getPath(_path)).map(filePath => {
    const absolutePath = getPath(`${_path}/${filePath}`);
    const stats = fs.statSync(absolutePath);
    if (stats.isDirectory()) {
      readDirectory(`${_path}/${filePath}`, files);
    } else {
      files.push(absolutePath);
    }
  });
  return files;
}

function writeNestedFile(filePath: string, content: string | Buffer) {
  const currentDir = getPath('.');
  const components = filePath
    .replace(currentDir, '$CURRENT_DIR')
    .split('/')
    .map(word => word.replace('$CURRENT_DIR', '.'));
  const paths = components.map((_, index) => path.resolve(getPath('.'), ...components.slice(0, index + 1)));
  for (let i = 0; i < paths.length; i++) {
    const component = paths[i];
    if (i === paths.length - 1) {
      fs.writeFileSync(component, content);
    } else {
      if (!fs.existsSync(component)) {
        fs.mkdirSync(component);
      }
    }
  }
}

function handleCompile(vars: CompileContext, { srcPath, distPath }: { srcPath: string; distPath: string }) {
  const currentDir = getPath('.');
  const src = readDirectory(srcPath.replace(currentDir, '.'));
  for (const absolutePathSrc of src) {
    const source = absolutePathSrc;
    const sourceContent = fs.readFileSync(source);
    const sourceStat = fs.lstatSync(source);
    const isBinary = isBinaryFileSync(sourceContent, sourceStat.size);
    let content = isBinary ? sourceContent : sourceContent.toString();

    const dist = fillVars(vars, absolutePathSrc.replace(srcPath, distPath), {
      src: { dir: srcPath, file: source, isBinary, content },
    });

    if (!isBinary) {
      content = fillVars(vars, content.toString(), {
        src: { dir: srcPath, file: source, content, isBinary },
        dist: { dir: distPath, file: dist },
      });
    }
    console.log(
      `compile:`,
      `${absolutePathSrc} => ${dist}`.replace(RegExp(getPath('.').replace(/[.]/g, '[.]').replace(/\//g, '/'), 'g'), '.')
        .yellow,
    );

    writeNestedFile(dist, content);
  }
}

export default function compileTemplate(options: CompileContext | CompileContext[], src: string, dist: string) {
  if (!src || !dist) return console.log('src and dist must be defined');
  const srcPath = getPath(src);
  const distPath = getPath(dist);
  fs.rmSync(distPath, { force: true, recursive: true });
  if (Array.isArray(options)) {
    for (const _options of options) handleCompile(_options, { srcPath, distPath });
  } else {
    handleCompile(options, { srcPath, distPath });
  }
}

const compilerOptions: CompileContext[] = Array(3)
  .fill(0)
  .map((_, index) => ({
    tokenId: index,
    filename: ({ dist }) => {
      return `File: ${dist?.file}:${index}`;
    },
  }));

compileTemplate(compilerOptions, 'src/template', 'build/vebanny/template');
