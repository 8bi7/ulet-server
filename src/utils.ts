const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  countries,
  names,
  languages,
  starWars,
} = require("unique-names-generator");

export const generateUniqueName = () =>
  uniqueNamesGenerator({
    dictionaries: [
      adjectives,
      animals,
      colors,
      countries,
      names,
      languages,
      starWars,
    ],
    length: 2,
  });
