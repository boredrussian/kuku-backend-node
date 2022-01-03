# Signed Backend for NodeJS and AWS

The backend is built using AWS Lambda, DynamoDB, S3, and SQS.

## Deployment

## Lambda
We use the same Lambda for all API requests and SQS messages to minimize Lambda cold starts. The Lambda contains an internal router that invokes a module that corresponds to the request type

## DynamoDB structure
The 'signed' table is defined as:
- primary key: PK string
- sort key: SK string

Here is the list of all used combinations of PK/SK
- all-sources / [address] - sourceJSON
- post-[address] / [createdAt] - postJSON, replies, likes, reposts
- hash-[hash] / [createdAt]-[address] - type, size, mime-type, username, uploadedAt
- tag-[tag-name-base64] / [createdAt]-[address] 
- reply-to-[post-hash] / [createdAt]-[address] - replies to a particular post version
- like-[post-hash] / [createdAt]-[address] - likes of a particular post version
- repost-[post-hash] / [createdAt]-[address] - reposts of a particular post version
- all-users / [username]
- inbox-[address] / [createdAt] - post, source

## Internal DB API
- putItem(Item)
- getItem(PK, SK)
- getItems(PK, fromSK, toSK)
  - implements paging internally 
- delete([PK, SK]) - deletes in batches of 25

## Internal S3 asset store API
- putItem(content, address, createdAt, type, mime-type, username) returns hash

# Public API

- getPosts for a particular timestamp range (createdAt)
  - of several source addresses 
   - combine results of getItems(post-address, fromSK, toSK) 
  - OR with a particular tag
   - combine results of getItems(tag-name, fromSK, toSK)
  - OR replies to a specific post hash
   - combine results of getItems(reply-to-hash, fromSK, toSK)
- getSources by a list of addresses
- getDefaultSources

# Inbox API
- addPost(post, source)

# Private API
- addPost (post, source)
- uploadAsset
- registerUser
- login flow
