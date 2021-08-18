const spawn = require('cross-spawn');
const webpack = require('webpack');
const path = require('path');
const webpackConfigClient = require('./configs/webpack.config.client');
const webpackConfigServer = require('./configs/webpack.config.server');

const compiler = webpack([
  {
    ...webpackConfigClient,
    devtool: 'source-map',
    mode: 'development',
    output: {
      ...webpackConfigClient.output,
      filename: '[name].js'
    }
  },
  {
    ...webpackConfigServer,
    devtool: 'source-map',
    mode: 'development',
  }
]);

let node;

compiler.hooks.watchRun.tap('Dev', (compiler) => {
  console.log(`Compiling ${compiler.name}`);
  if (compiler.name === 'server' && node) {
    node.kill();
    node = undefined;
  }
});

compiler.watch({}, (err, stats) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(stats?.toString('minimal'));
  const compiledSuccessfully = !stats?.hasErrors();
  if (compiledSuccessfully && !node) {
    console.log(`Stating Node.js ...`);
    node = spawn(
      'node',
      ['--inspect', path.join(__dirname, 'dist/server.js')],
      {
        stdio: 'inherit',
      }
    );
  }
})

