## Process flex-cli

### List

```
flex-cli process list -m deliverski-test
```

### Create alias

```
flex-cli process create-alias -m deliverski-test --process flex-product-default-process --alias accept-decline-v1 --version X
```

### Update process

```
flex-cli process --path ext/transaction-process
flex-cli process push -m deliverski-test --path ext/transaction-process --process flex-product-default-process
```
### Update alias

```
flex-cli process update-alias -m deliverski-test --process flex-product-default-process --alias accept-decline-v1 --version X
```

