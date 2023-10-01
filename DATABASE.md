# Databases

## Index

* Database - `accounts`
  * Collection - `accounts`
  * Collection - `account_sessions`
* Database - `payment_methods`
* Database - `app`

## Database - `accounts`

The user accounts database.

### Collection - `accounts`

Collection that holds the the user accounts.

|Key|Type|Description|Required|
|-|-|-|-|
|`id`|`string<uuid>`|Internal user ID, independent from the MongoDB assigned ID.|Yes|
|`email`|`string`|Email address of the user, used to sign in.|Yes|
|`password`|`string<bcrypt hash>`|User password, hashed with bcrypt.|Yes|
|`first_name`|`string`|First name of the user.|No|
|`last_name`|`string`|Last name of the user.|No|
|`date_created`|`date`|Date when the account was created.|Yes|

### Collection - `account_sessions`

Collection that holds all active session tokens used to make authenticated API calls.

|Key|Type|Description|Required|
|-|-|-|-|
|`session_token`|`string`|Session token used to make API calls.|Yes|
|`date_created`|`date`|Date when the session token was created.|Yes|
|`ip_address`|`string`|IP address that requested a new session token.|Yes|
|`creation_source`|`string`|Source of how the session token was created.|Yes|

## Database - `payment_methods`

The database that holds all of the credit cards of the users.

## Database - `app`

General database where non-sensitive parts of the app are held. Each data category is separated by collections.