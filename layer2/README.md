# Layer2 Package

This package serves as a stand-alone lib that can be published t npm and imported into `widget/package` ro provide necessary logic to perform swaps form ETH => ERC-20.

## Local development

Import layer2 into package using `npm link`.

inside `widget/layer2`:

```bash
npm install
npm link
npm run start
```

inside `widget/package`:

```bash
npm link layer2
npm run start:local
```
