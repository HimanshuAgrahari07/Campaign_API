const firstNameList = [
  "Aaron",
  "Adam",
  "Benjamin",
  "Christopher",
  "Daniel",
  "David",
  "Dewey",
  "Edward",
  "Ethan",
  "Harrison",
  "Harry",
  "Jacob",
  "Joshua",
  "Liam",
  "Michael",
  "Muhammad",
  "Oliver",
  "Richard",
  "Robert",
  "Thomas",
  "William",
];

const lastNameList = [
  "Adams",
  "Barnett",
  "Figueroa",
  "Fisher",
  "Foster",
  "Garcia",
  "Griffin",
  "Houghton",
  "Lawson",
  "Lee",
  "Mcgee",
  "Pena",
  "Perry",
  "Ramsey",
  "Richards",
  "Ross",
  "Russell",
  "Santos",
  "Stevens",
  "Townsend",
  "Whittle",
];

const organisationList = [
  { "name": "Osmosys1", "uid": "OSM1" },
  { "name": "Osmosys2", "uid": "OSM2" },
  { "name": "Osmosys3", "uid": "OSM3" },
  { "name": "Osmosys4", "uid": "OSM4" },
  { "name": "Osmosys5", "uid": "OSM5" },
  { "name": "Osmosys6", "uid": "OSM6" }
]

function _getRandomEntry(entryList) {
  const idx = Math.floor(Math.random() * entryList.length);
  return entryList[idx];
}

const phoneNumberCounter = makeCounter();

exports.generateUserWithNewOrganisation = () => {
  const organisation = _getRandomEntry(organisationList);
  const firstName = _getRandomEntry(firstNameList)
  const lastName = _getRandomEntry(lastNameList)
  const email = `${firstName}.${lastName}.${Math.floor(Math.random() * 100)}@gmail.com`
  const mobile = `${phoneNumberCounter()}`.padStart(10, "0");
  const countryId = 
   _getRandomEntry(newUserWithNewOrg)
};

exports.generateUserWithExistingOrganisation = (organisationId) => {
  const basicInfo = _getRandomEntry(newUserWithExistingOrg)

  return {
    ...basicInfo,
    organisationId: organisationId
  }
};

exports.generateDevice = (resolutionId) => {
  const basicInfo = _getRandomEntry(newUserWithExistingOrg)

  return {
    ...basicInfo,
    resolutionId: resolutionId
  }
};

exports.generateOrganisation = () => {
  return _getRandomEntry(organisationList)
};