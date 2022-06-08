import path from 'path';
import { Project } from '../other/project';
import { parse_csv } from './fs';

export function replaceTemplateText(tableRow: any, template: string) {
  const descriptionColumns = template.match(/[^{\{]+(?=}\})/g);
  let result = template;
  if (descriptionColumns && descriptionColumns.length > 0) {
    descriptionColumns.forEach(column => {
      result = result.replace(`{{${column}}}`, tableRow[column]);
    });
  }
  return result;
}

export async function getMetadataRow(project: Project, name: string): Promise<any> {
  if (project.config.metadata_input.population_metadata?.metadata_source) {
    const jsonMetadata = (await parse_csv(
      path.join(__dirname, '../..', project.config.metadata_input.population_metadata?.metadata_source),
    )) as any[];
    const nameColumn = project.config.metadata_input.name.match(/[^{\{]+(?=}\})/g)?.[0];
    return nameColumn ? jsonMetadata.find(item => name === item[nameColumn]) : null;
  }
  return null;
}
