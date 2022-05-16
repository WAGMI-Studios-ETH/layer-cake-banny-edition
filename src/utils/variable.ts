const varExtractor = new RegExp('(.*)');

export function getVariableName<TResult>(getVar: () => TResult) {
  const m = varExtractor.exec(getVar + '');
  if (m == null) throw new Error("The function does not contain a statement matching 'return variableName;'");
  let fullMemberName = m[1];
  let memberParts = fullMemberName.split('.');
  return memberParts[memberParts.length - 1];
}

async () => {
  const foo = { very_long_variable_name: 'short value' };
  const varName = getVariableName(() => foo.very_long_variable_name);
  console.log(`${varName}:${foo.very_long_variable_name}`);
};
