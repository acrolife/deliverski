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

# One signal App

You can create a new app by clicking on the OneSignal logo in the upper left
corner.

"localhost" in "sandbox" should have two separate "web apps", each with its own
config in OneSignal.

All settings in the "Web app" must be ready when you press the "Save" button
for the first time. If the settings are corrected, the changes do not appear
and errors cannot be found. If the "web app" doesn't work, I delete it and
make it again.

1. New web app
2. Choose integration: Custom code !!!
3. Sitename: test
4. Site URL http://localhost:3000
5. Auto resubscribe: OFF
6. Local testing OFF. Treat HTTP localhost as HTTPS for testing

7. My site is not fully HTTPS: ON
8. CHOOSE A LABEL: ith-marmott

If the "localhost" settings are correct, a red bell should appear on the screen
when running flex web.

If a red bell does not appear, something is wrong with the settings. My
experience is to delete the app and start over. For reasons unknown to us, the
corrections are not appearing. Errors can be seen in the browser console.

