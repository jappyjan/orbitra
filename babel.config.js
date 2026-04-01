module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Transform import.meta.env references for web compatibility.
      // Metro outputs a regular <script defer> (not type="module"), so
      // import.meta is a syntax error in that context. Zustand's devtools
      // middleware references import.meta.env.MODE at build time.
      importMetaEnvPlugin,
    ],
  };
};

function importMetaEnvPlugin() {
  return {
    visitor: {
      MemberExpression(path) {
        // Match: import.meta.env.MODE -> process.env.NODE_ENV
        // Match: import.meta.env -> { MODE: process.env.NODE_ENV }
        const { node } = path;
        if (
          node.object.type === 'MetaProperty' &&
          node.object.meta.name === 'import' &&
          node.object.property.name === 'meta'
        ) {
          if (node.property.name === 'env' || node.property.value === 'env') {
            // Check if parent accesses .MODE
            const parent = path.parentPath;
            if (
              parent.isMemberExpression() &&
              (parent.node.property.name === 'MODE' ||
                parent.node.property.value === 'MODE')
            ) {
              // import.meta.env.MODE -> process.env.NODE_ENV
              parent.replaceWithSourceString('process.env.NODE_ENV');
            } else if (
              parent.isConditionalExpression() ||
              parent.isLogicalExpression() ||
              parent.isCallExpression()
            ) {
              // import.meta.env -> { MODE: process.env.NODE_ENV }
              path.replaceWithSourceString(
                '({ MODE: process.env.NODE_ENV })'
              );
            } else {
              // Fallback
              path.replaceWithSourceString(
                '({ MODE: process.env.NODE_ENV })'
              );
            }
          }
        }
      },
    },
  };
}
