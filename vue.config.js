const path = require('path');

module.exports = {
    outputDir: path.resolve('../public'),
    devServer: {
        proxy: {
            "/": {
              target: "http://localhost:3001"
            }
          }
    }
};
