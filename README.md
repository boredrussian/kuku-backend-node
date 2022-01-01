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
- post-[address] / [createdAt] - postJSON
- tag-[tag-name-base64] / [createdAt]-[address] 
- all-users / [username]
- inbox-[address] / [createdAt]


### Users
###
