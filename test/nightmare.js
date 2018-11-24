const Nightmare = require('nightmare');
const nightmare = Nightmare({show: false});

nightmare
  .goto(`http://localhost:8080/test/`)
  .evaluate(() => {
    window.assert = (ok, message) =>
      console.warn('nightmare', !!ok, message || 'unknown');
  })
  .on('console', (type, ...args) => {
    if (type === 'warn' && args[0] === 'nightmare') {
      type = 'assert';
      args.shift();
    }
    switch (type) {
      case 'assert':
        const [ok, message] = args;
        if (!ok) exit(new Error(message));
        else console.log(`  \x1B[0;32m✔\x1B[0;0m  ${message}`);
        break;
      case 'error':
        exit(new Error(args[0]));
      default:
        console[type](...args);
    }
  })
  .evaluate(() => {
    const constructor = customElements.get('my-button');
    assert(typeof constructor === 'function', 'MyButton is registered');
    const mybtn = document.querySelector('button[is="my-button"]');
    assert(mybtn instanceof constructor, 'DOM node was upgraded');
    assert(mybtn.style.color === 'blue', 'attribute change applied');
  })
  .end()
  .catch(exit);

function exit(error) {
  console.error(error);
  process.exit(1);
}
