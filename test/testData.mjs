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

function makeId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function _getRandomEntry(entryList) {
  const idx = Math.floor(Math.random() * entryList.length);
  return entryList[idx];
}

const makeCounter = () => {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
};

const phoneNumberCounter = makeCounter();

function createOrganisation() {
  const uid = makeId(4);
  const name = makeId(10);

  return { uid, name }
}

function createBasicUser() {
  const firstName = _getRandomEntry(firstNameList)
  const lastName = _getRandomEntry(lastNameList)
  const email = `${firstName}.${lastName}.${Math.floor(Math.random() * 100)}@gmail.com`
  const mobile = `${Math.floor(Math.random() * 100000)}`.padStart(10, "0");
  const countryId = Math.floor(Math.random() * 100);
  const password = `${firstName}${lastName}123`;

  return {
    email,
    firstName,
    lastName,
    mobile,
    countryId,
    password
  }
}


export const generateUserWithNewOrg = () => {
  return {
    ...createBasicUser(),
    organisation: createOrganisation(),
  }
};

export const generateUserWithExistingOrg = (organisationId) => {
  return {
    ...createBasicUser(),
    organisationId,
    role: 'USER'
  }
};

export const generateDevice = (resolutionId) => {
  return {
    uid: makeId(4),
    deviceName: makeId(20),
    deviceModel: makeId(15),
    deviceBrand: makeId(10),
    resolutionId: resolutionId || Math.floor(Math.random() * 10),
    deviceSize: `${Math.floor(Math.random() * 100)} inch`,
    deviceLocation: makeId(10),
    deviceStatus: ['CONFIGURED', 'NOT CONFIGURED'][Math.floor(Math.random() * 2)],
  }
};