module.exports = (function() {
  var config, env, key, ref, settings, value;
  config = {
    global: {
      session: {
        db: "sessions",
        secret: "n0d1n_sEcret"
      }
    },
    development: {
      db: "mongodb://localhost/morevue",
      website: "http://0.0.0.0:9900",
      app: {
        name: "morevue dev"
      },
      env: "dev"
    },
    production: {
      origins: ["http://0.0.0.0:9900"],
      db: process.env.MONGOLAB_URI,
      website: "http://morevue.standupweb.net",
      app: {
        name: "morevue"
      },
      env: "prod"
    }
  };
  settings = config.global;
  env = process.env.NODE_ENV || "development";
  settings.env = env;
  if (env === "test") {
    env = "production";
  }
  ref = config[env];
  for (key in ref) {
    value = ref[key];
    settings[key] = value;
  }
  return settings;
})();
