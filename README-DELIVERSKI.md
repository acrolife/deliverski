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

## SMS

Please follow the OneSignal documentation and connect your twilio account.


# OneSignal env

Please fill in the .env file

```
REACT_APP_ONESIGNAL_APP_ID=
REACT_APP_ONESIGNAL_SAFARI_WEB_ID=
# this is for localhost only
REACT_APP_ONESIGNAL_SUBDOMAIN_NAME=
ONE_SIGNAL_API_KEY=
# This phone number is provided by twilio
ONE_SIGNAL_SMS_FROM=
```

# Dokku

## dokku sandbox

Please make sure your workstation's SSH key is added to the dokku when running
the command:

```
ssh dokku@82.165.97.27 apps:list
```

Please add git repo on localhost

```
git remote add sandbox dokku@82.165.97.27:marmott-sandbox
```

Deliver code from dev branch to the sandbox

```
git push sandbox dev
```

## dokku production

For easier work with docker, assign an appropriate group to your user

```
# sudo usermod -aG docker aivils
# sudo usermod -aG dokku aivils
```
Please add git repo on localhost

```
git remote add production dokku@82.165.179.225:marmott-production
```

Deliver code from dev branch to the production

```
git push production master
```

# Email notifications

##expired-accept-provider

```
flex-cli notifications preview  -m deliverski-test --context sample-template-context.json --template ext/transaction-process/templates/expired-accept-provider
```

##expired-accept-customer

```
flex-cli notifications preview  -m deliverski-test --context sample-template-context.json --template ext/transaction-process/templates/expired-accept-customer
```

