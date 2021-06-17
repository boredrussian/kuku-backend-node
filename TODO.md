# TODO

-   [ ] add errors in response `savePost` :
    -   ;
    -  .
-   [ ]  take out json libs:
-   [ ]  do JsonReader  
    -   .
-   [ ]  do validation  module `register`, and other modules get data user created; 
-   [ ]  need to realize is possible update dynamoDb without two queries in db(first query, get primery key,
  and net update use primary)
-   [ ] take out utils in data base and libs(json) ; 
 
 
GlobalSecondaryIndexes:
        - IndexName: gsiCaseCountTable
          KeySchema:
            - AttributeName: table-name
              KeyType: HASH
          Projection:
            NonKeyAttributes:
            ProjectionType: INCLUDE
              - count

!!!
-   [ ] set jwt in headers Barrier; 
-   [ ] set jwt in headers Barrier; 
