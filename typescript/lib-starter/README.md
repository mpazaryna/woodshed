# password-hashing

A simple package to hash passwords and verify if the password and the hash match

## Installation
```
yarn add password-hashing
```

## Usage
```javascript
import { validatePassword, hashPassword } from "password-hashing"

const { hash, salt } = hashPassword("YOUR PASSWORD")

const isValid = validatePassword("YOUR PASSWORD", salt, hash) // Is the password valid?
```

## Functions

<dl>
<dt><a href="#validatePassword">validatePassword(inputPassword, salt, storedHash)</a> ⇒ <code>boolean</code></dt>
<dd><p>Given an input password a salt and an hash
Does the given password match with the hash?</p>
</dd>
<dt><a href="#hashPassword">hashPassword(password)</a> ⇒ <code><a href="#HashAndSalt">HashAndSalt</a></code></dt>
<dd><p>Given a Password, hash it with a salt, then return the hash and the salt</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#HashAndSalt">HashAndSalt</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="validatePassword"></a>

## validatePassword(inputPassword, salt, storedHash) ⇒ <code>boolean</code>
Given an input password a salt and an hash
Does the given password match with the hash?

**Kind**: global function  
**Returns**: <code>boolean</code> - does hash(inputPassword + salt) === storedHash?  

| Param | Type |
| --- | --- |
| inputPassword | <code>string</code> | 
| salt | <code>string</code> | 
| storedHash | <code>string</code> | 

<a name="hashPassword"></a>

## hashPassword(password) ⇒ [<code>HashAndSalt</code>](#HashAndSalt)
Given a Password, hash it with a salt, then return the hash and the salt

**Kind**: global function  
**Returns**: [<code>HashAndSalt</code>](#HashAndSalt) - object containing the hash and the salt used  

| Param | Type |
| --- | --- |
| password | <code>string</code> | 

<a name="HashAndSalt"></a>

## HashAndSalt : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | The hash we got |
| salt | <code>string</code> | The salt used to hash |
