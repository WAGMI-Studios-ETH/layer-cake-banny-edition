import fs from 'fs';
import path from 'path';
import { Asset } from '../other/asset';
import { Project } from '../other/project';
import { parse } from 'csv-parse/sync';

type BasicTypes = string | number | boolean;

type Context = Record<string, any>;

type CompileContext = {
  [key: string]: BasicTypes | ((context: Context) => BasicTypes);
};

export function fillVars(template: string, vars: CompileContext, context?: Context) {
  let result = template;
  for (const key in vars) {
    while (result.includes(`{{${key}}}`)) {
      result = result.replace(
        `{{${key}}}`,
        typeof vars[key] === 'function' ? (vars[key] as Function)(context).toString() : vars[key].toString(),
      );
    }
  }
  return result;
}

function parseCsv(csv: string) {
  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
}

export function generateVars(...sources: any[]) {
  const vars: Record<string, any> = {};
  for (let source of sources) {
    if (typeof source === 'string') {
      if (source.startsWith('./')) {
        const filePath = path.resolve(__dirname, '../../', source);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        if (filePath.endsWith('.json')) {
          source = JSON.parse(fileContents);
        } else if (filePath.endsWith('.csv')) {
          source = parseCsv(fileContents);
        }
      }
    }

    if (typeof source === 'object') {
      for (const key in source) {
        switch (typeof source[key]) {
          case 'string':
          case 'number':
          case 'boolean':
            vars[key] = source[key];
            break;
          case 'object':
            const subVars = generateVars(source[key]);
            for (const subKey in subVars) {
              vars[key + '.' + subKey] = subVars[subKey];
            }
            break;
        }
      }
    }
  }
  // console.log(Object.keys(vars).filter(key => key.match('traits')));
  return vars;
}
