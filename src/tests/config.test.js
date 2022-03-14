const { configDB1, configDB2 } = require("../config/configDB");
const { configColumns } = require("../config/configColumns");

test('Checking configuration for database 1', async() => {
    expect(configDB1.host).toEqual(expect.anything());
    expect(configDB1.host.length).toBeGreaterThan(0);
    
    expect(configDB1.database).toEqual(expect.anything());
    expect(configDB1.database.length).toBeGreaterThan(0);

    expect(configDB1.user).toEqual(expect.anything());
    expect(configDB1.user.length).toBeGreaterThan(0);

    expect(configDB1.port).toEqual(expect.anything());
    expect(configDB1.port).toBeGreaterThan(0);
});

test('Checking configuration for database 2', async() => {
    expect(configDB2.host).toEqual(expect.anything());
    expect(configDB2.host.length).toBeGreaterThan(0);
    
    expect(configDB2.database).toEqual(expect.anything());
    expect(configDB2.database.length).toBeGreaterThan(0);

    expect(configDB2.user).toEqual(expect.anything());
    expect(configDB2.user.length).toBeGreaterThan(0);

    expect(configDB2.port).toEqual(expect.anything());
    expect(configDB2.port).toBeGreaterThan(0);
});

test('Checking anonymise columns', async() => {
    // it could be 0 columns to anonymise
    expect(configColumns).toEqual(expect.anything());
});