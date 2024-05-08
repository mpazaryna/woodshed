const {MongoClient} = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,  useUnifiedTopology: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');
    const mockUser = {_id: 'some-user-id', name: 'John'};
    await users.insertOne(mockUser);
    const insertedUser = await users.findOne({_id: 'some-user-id'});
    expect(insertedUser).toEqual(mockUser);
  });
});

describe('query', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true, useUnifiedTopology: true
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
    const users = db.collection('users');
    const mockUser = {_id: 'some-user-id-02', name: 'John'};
    await users.insertOne(mockUser);
  
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should find the document', async () => {
    const users = db.collection('users');
    const mockUser = {_id: 'some-user-id-02', name: 'John'};
    const insertedUser = await users.findOne({_id: 'some-user-id-02'});
    expect(insertedUser).toEqual(mockUser);
  });
});