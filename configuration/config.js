//Esta informacion debe estar recorda y actualizada en api_catalogo.config

const config = {
  app: {
    port: "3000",
    host: "localhost",
    api_key: "1234",
    backup: false
  },
  db: {
    host: 'puxbit.cw2n3i6utgwc.us-east-2.rds.amazonaws.com',
    port: "5432",
    database: 'public',
    user: 'puxbit',
    password: 'N1lointentes2018'
  }
};

module.exports = config;
